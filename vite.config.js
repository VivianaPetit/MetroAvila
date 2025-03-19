import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa'; 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Metroavila',
        short_name: 'Metroavila',
        description: 'Galería y destinos Metroavila',
        theme_color: '#889e19',
        background_color: '#F2F5E5',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
          {
            src: '/icon-512x512.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ],
      },
    }),
  ],
});
