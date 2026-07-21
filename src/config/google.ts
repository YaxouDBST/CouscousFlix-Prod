// Fonction pour obtenir l'URL de redirection de manière dynamique
const getRedirectUri = () => {
  // Utiliser le domaine actuel du site dans tous les cas
  // Tous les domaines sont maintenant configurés dans Google Cloud Console
  return `${window.location.origin}/auth/google`;
};

export const GOOGLE_CONFIG = {
  CLIENT_ID: '720624991465-e20dthtgo0hg8lt4ts15b7jucjhdl0rs.apps.googleusercontent.com',
  
  get REDIRECT_URI() {
    return getRedirectUri();
  },
  SCOPES: ['email', 'profile']
}; 