import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Make environment variables available at build time for HTML replacement
    __VITE_APP_BASE_URL__: JSON.stringify(process.env.VITE_APP_BASE_URL || 'https://monadfolio.vercel.app'),
    __VITE_APP_ICON_URL__: JSON.stringify(process.env.VITE_APP_ICON_URL || 'https://monadfolio.vercel.app/appicon.png'),
    __VITE_BG_IMAGE_URL__: JSON.stringify(process.env.VITE_BG_IMAGE_URL || 'https://monadfolio.vercel.app/bgimage.jpg'),
    __VITE_SPLASH_BG_COLOR__: JSON.stringify(process.env.VITE_SPLASH_BG_COLOR || '#0EA5E9'),
  },
});
