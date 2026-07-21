window.hasYaxouDBSTExtension = true;
window.hasYaxouDBSTNexusExtractor = true; // Signals that M3U8 extraction is available locally
window.dispatchEvent(new CustomEvent('yaxoudbst-extension-loaded'));
console.log("YaxouDBST Extension loaded in page context (with Nexus M3U8 extractors)");

/**
 * Helper: Extract M3U8 from a single embed URL via the extension
 * Usage: const result = await window.yaxoudbstExtractM3u8('voe', 'https://voe.sx/xxx');
 *        or: const result = await window.yaxoudbstExtractM3u8(null, 'https://vidzy.org/xxx'); // auto-detect
 * Returns: { success, hlsUrl?, m3u8Url?, source?, error? }
 */
window.yaxoudbstExtractM3u8 = function(type, url) {
    return new Promise((resolve, reject) => {
        const messageId = 'nexus_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

        const handler = (event) => {
            if (event.data && event.data.source === 'YAXOUDBST_EXTENSION' && event.data.messageId === messageId) {
                window.removeEventListener('message', handler);
                if (event.data.success) {
                    resolve(event.data.data);
                } else {
                    resolve({ success: false, error: event.data.error });
                }
            }
        };

        window.addEventListener('message', handler);

        // Timeout after 15s
        setTimeout(() => {
            window.removeEventListener('message', handler);
            resolve({ success: false, error: 'Extraction timeout' });
        }, 15000);

        window.postMessage({
            source: 'YAXOUDBST_WEB',
            type: 'EXTENSION_REQUEST',
            action: 'EXTRACT_M3U8',
            messageId,
            payload: { type, url }
        }, '*');
    });
};

/**
 * Helper: Extract all M3U8 from a list of embed sources in parallel
 * Usage: const results = await window.yaxoudbstExtractAllM3u8(['https://voe.sx/x', 'https://vidzy.org/y']);
 *        or with player info: await window.yaxoudbstExtractAllM3u8([{link:'url', player:'voe'}]);
 * Returns: { success, total, successCount, results: [...] }
 */
window.yaxoudbstExtractAllM3u8 = function(sources) {
    return new Promise((resolve, reject) => {
        const messageId = 'nexus_all_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

        const handler = (event) => {
            if (event.data && event.data.source === 'YAXOUDBST_EXTENSION' && event.data.messageId === messageId) {
                window.removeEventListener('message', handler);
                if (event.data.success) {
                    resolve(event.data.data);
                } else {
                    resolve({ success: false, error: event.data.error, results: [] });
                }
            }
        };

        window.addEventListener('message', handler);

        // Timeout after 30s for batch extraction
        setTimeout(() => {
            window.removeEventListener('message', handler);
            resolve({ success: false, error: 'Bulk extraction timeout', results: [] });
        }, 30000);

        window.postMessage({
            source: 'YAXOUDBST_WEB',
            type: 'EXTENSION_REQUEST',
            action: 'EXTRACT_ALL_M3U8',
            messageId,
            payload: { sources }
        }, '*');
    });
};

/**
 * Helper: Detect supported embed types from a list of URLs
 * Usage: const embeds = await window.yaxoudbstDetectEmbeds(['url1', 'url2']);
 * Returns: { embeds: [{type, url, priority}, ...] }
 */
window.yaxoudbstDetectEmbeds = function(sources) {
    return new Promise((resolve) => {
        const messageId = 'nexus_detect_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

        const handler = (event) => {
            if (event.data && event.data.source === 'YAXOUDBST_EXTENSION' && event.data.messageId === messageId) {
                window.removeEventListener('message', handler);
                resolve(event.data.success ? event.data.data : { embeds: [] });
            }
        };

        window.addEventListener('message', handler);
        setTimeout(() => { window.removeEventListener('message', handler); resolve({ embeds: [] }); }, 5000);

        window.postMessage({
            source: 'YAXOUDBST_WEB',
            type: 'EXTENSION_REQUEST',
            action: 'DETECT_EMBEDS',
            messageId,
            payload: { sources }
        }, '*');
    });
};

/**
 * Helper: Setup DNR headers for a service URL (e.g. cinep for PurStream)
 * Usage: await window.yaxoudbstSetupHeaders('cinep', 'https://zebi.xalaflix.design/...');
 */
window.yaxoudbstSetupHeaders = function(type, url) {
    return new Promise((resolve) => {
        const messageId = 'nexus_headers_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

        const handler = (event) => {
            if (event.data && event.data.source === 'YAXOUDBST_EXTENSION' && event.data.messageId === messageId) {
                window.removeEventListener('message', handler);
                resolve(event.data.success ? event.data.data : { success: false, error: event.data.error });
            }
        };

        window.addEventListener('message', handler);
        setTimeout(() => { window.removeEventListener('message', handler); resolve({ success: false, error: 'Timeout' }); }, 3000);

        window.postMessage({
            source: 'YAXOUDBST_WEB',
            type: 'EXTENSION_REQUEST',
            action: 'SETUP_HEADERS',
            messageId,
            payload: { type, url }
        }, '*');
    });
};
