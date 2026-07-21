
interface ExtensionResponse<T = unknown> {
    source: string;
    messageId: string;
    success: boolean;
    data?: T;
    error?: string;
}

export const isExtensionAvailable = (): boolean => {
    const w = window as Window & {
        hasCouscousFlixExtension?: boolean;
        __COUSCOUSFLIX_EXTENSION_INSTALLED?: boolean;
        hasCouscousFlixUserscript?: boolean;
    };
    return (
        w.hasCouscousFlixExtension === true ||
        w.__COUSCOUSFLIX_EXTENSION_INSTALLED === true ||
        w.hasCouscousFlixUserscript === true ||
        document.documentElement?.dataset.couscousflixExtension === 'true'
    );
};

export const fetchFromExtension = <T = unknown>(
    action: string,
    payload: Record<string, unknown> = {}
): Promise<T> => {
    return new Promise((resolve, reject) => {
        if (!isExtensionAvailable()) {
            return reject(new Error("Extension not available"));
        }

        const accessKey = window.localStorage.getItem("access_code");
        const enrichedPayload = payload && typeof payload === "object" && !Array.isArray(payload)
            ? { ...payload, ...(accessKey ? { accessKey } : {}) }
            : payload;

        const messageId = Math.random().toString(36).substring(7);

        const handler = (event: MessageEvent<ExtensionResponse<T>>) => {
            const response = event.data;

            // We accept messages from window, must be from extension content script
            if (event.source !== window || !response || response.source !== "COUSCOUSFLIX_EXTENSION") return;

            if (response.messageId === messageId) {
                window.removeEventListener("message", handler);
                if (response.success) {
                    resolve(response.data as T);
                } else {
                    reject(new Error(response.error || "Unknown extension error"));
                }
            }
        };

        window.addEventListener("message", handler);
        window.postMessage({
            source: "COUSCOUSFLIX_WEB",
            type: "EXTENSION_REQUEST",
            action,
            payload: enrichedPayload,
            messageId
        }, "*");

        // Timeout after 10 seconds
        setTimeout(() => {
            window.removeEventListener("message", handler);
            reject(new Error("Extension request timed out"));
        }, 10000);
    });
};
