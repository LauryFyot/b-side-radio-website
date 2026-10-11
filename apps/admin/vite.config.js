import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/radio/legacy': {
        target: 'http://91.134.242.174:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/radio\/legacy/, '')
      }
    }
  }
});