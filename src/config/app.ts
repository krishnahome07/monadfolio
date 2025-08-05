// Centralized app configuration
export const APP_CONFIG = {
  // App Identity
  name: 'Monadfolio',
  title: 'Monadfolio - Your Monad Portfolio & Identity',
  description: 'Transform your Monad wallet into a social, shareable on-chain identity. Visualize your portfolio, earn badges, and stay updated with Monad news.',
  
  // URLs and Assets
  baseUrl: 'https://monadfolio.vercel.app',
  appIcon: 'https://monadfolio.vercel.app/appicon.png',
  bgImage: 'https://monadfolio.vercel.app/bgimage.jpg',
  splashBackgroundColor: '#6B46C1',
  
  // Farcaster Configuration
  farcaster: {
    version: 'next',
    buttonTitle: 'Open Monadfolio 💼',
    actionType: 'launch_miniapp' as const,
    splashImageUrl: 'https://monadfolio.vercel.app/appicon.png'
  },
  
  // Social Media
  ogType: 'website',
  twitterCard: 'summary_large_image'
} as const;

// Helper function to generate Farcaster miniapp config
export const getFarcasterMiniappConfig = () => ({
  version: APP_CONFIG.farcaster.version,
  imageUrl: APP_CONFIG.bgImage,
  button: {
    title: APP_CONFIG.farcaster.buttonTitle,
    action: {
      type: APP_CONFIG.farcaster.actionType,
      name: APP_CONFIG.name,
      url: APP_CONFIG.baseUrl,
      splashImageUrl: APP_CONFIG.farcaster.splashImageUrl,
      splashBackgroundColor: APP_CONFIG.splashBackgroundColor
    }
  }
});

// Helper function to generate frame config for backward compatibility
export const getFarcasterFrameConfig = () => ({
  version: APP_CONFIG.farcaster.version,
  imageUrl: APP_CONFIG.bgImage,
  button: {
    title: APP_CONFIG.farcaster.buttonTitle,
    action: {
      type: 'launch_frame' as const,
      name: APP_CONFIG.name,
      url: APP_CONFIG.baseUrl,
      splashImageUrl: APP_CONFIG.farcaster.splashImageUrl,
      splashBackgroundColor: APP_CONFIG.splashBackgroundColor
    }
  }
});