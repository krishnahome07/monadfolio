import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { APP_CONFIG, getFarcasterMiniappConfig, getFarcasterFrameConfig } from './src/config/app';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-app-config',
      transformIndexHtml(html) {
        const miniappConfig = JSON.stringify(getFarcasterMiniappConfig());
        const frameConfig = JSON.stringify(getFarcasterFrameConfig());
        
        return html
          .replace('__FARCASTER_MINIAPP_CONFIG__', miniappConfig)
          .replace('__FARCASTER_FRAME_CONFIG__', frameConfig)
          .replace('__OG_TITLE__', APP_CONFIG.title)
          .replace('__OG_DESCRIPTION__', APP_CONFIG.description)
          .replace('__OG_IMAGE__', APP_CONFIG.bgImage)
          .replace('__OG_TYPE__', APP_CONFIG.ogType)
          .replace('__OG_URL__', APP_CONFIG.baseUrl)
          .replace('__TWITTER_CARD__', APP_CONFIG.twitterCard)
          .replace('__TWITTER_TITLE__', APP_CONFIG.title)
          .replace('__TWITTER_DESCRIPTION__', APP_CONFIG.description)
          .replace('__TWITTER_IMAGE__', APP_CONFIG.bgImage);
      }
    },
    {
      name: 'inject-farcaster-config',
      generateBundle() {
        // Read and transform farcaster.json
        const fs = require('fs');
        const path = require('path');
        
        const farcasterPath = path.resolve(__dirname, 'public/.well-known/farcaster.json');
        if (fs.existsSync(farcasterPath)) {
          let content = fs.readFileSync(farcasterPath, 'utf-8');
          content = content
            .replace(/__APP_ICON__/g, APP_CONFIG.appIcon)
            .replace(/__SPLASH_BG_COLOR__/g, APP_CONFIG.splashBackgroundColor);
          
          fs.writeFileSync(farcasterPath, content);
        }
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react']
  }
});
