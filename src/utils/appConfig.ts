// Centralized app configuration
export const APP_CONFIG = {
  // Base URLs
  baseUrl: import.meta.env.VITE_APP_BASE_URL || 'https://monadfolio.vercel.app',
  
  // Image URLs
  appIconUrl: import.meta.env.VITE_APP_ICON_URL || 'https://monadfolio.vercel.app/appicon.png',
  bgImageUrl: import.meta.env.VITE_BG_IMAGE_URL || 'https://monadfolio.vercel.app/bgimage.jpg',
  
  // Colors
  splashBackgroundColor: import.meta.env.VITE_SPLASH_BG_COLOR || '#0EA5E9',
  
  // App Info
  appName: 'Monadfolio',
  appDescription: 'Transform your Monad wallet into a social, shareable on-chain identity. Visualize your portfolio, earn badges, and stay updated.',
  appTagline: 'Your Monad portfolio & on-chain identity',
  
  // Farcaster Configuration
  getFarcasterMiniappConfig() {
    return {
      version: 'next',
      imageUrl: this.bgImageUrl,
      button: {
        title: 'Open Monadfolio 💼',
        action: {
          type: 'launch_miniapp',
          name: this.appName,
          url: this.baseUrl,
          splashImageUrl: this.appIconUrl,
          splashBackgroundColor: this.splashBackgroundColor
        }
      }
    };
  },
  
  getFarcasterFrameConfig() {
    return {
      version: 'next',
      imageUrl: this.bgImageUrl,
      button: {
        title: 'Open Monadfolio 💼',
        action: {
          type: 'launch_frame',
          name: this.appName,
          url: this.baseUrl,
          splashImageUrl: this.appIconUrl,
          splashBackgroundColor: this.splashBackgroundColor
        }
      }
    };
  }
};