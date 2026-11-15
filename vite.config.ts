import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Configuración de Vite para Nubi (SPA React con TypeScript estricto y soporte PWA offline)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Nubi y el Archipiélago del Sueño',
        short_name: 'Nubi',
        description:
          'Aplicación interactiva de higiene del sueño para adolescentes basada en evidencia científica.',
        theme_color: '#5043C9',
        background_color: '#FFF9F0',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'es',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        // Permite cachear ilustraciones WebP de sellos y personajes (~320 KB) sin exceder el límite.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      // Alias canónico @/ para evitar rutas relativas profundas en componentes
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'es2022',
    // Los mapas de producción no se publican: no hay error tracking que los consuma.
    sourcemap: false,
  },
});
