import React, { useEffect } from 'react';

interface AdFreePlayerAdsProps {
  onClose?: () => void;
  onAccept?: () => void;
  adType?: "ad1" | "ad2";
  onAdClick?: () => void;
  variant?: "player" | "download" | "livetv";
}

const AdFreePlayerAds: React.FC<AdFreePlayerAdsProps> = ({ onClose, onAccept }) => {
  useEffect(() => {
    // Immédiatement accepter et fermer pour contourner complètement la publicité
    if (onAccept) {
        onAccept();
    }
    if (onClose) {
        onClose();
    }
  }, [onAccept, onClose]);
  
  return null;
};

export default AdFreePlayerAds;
