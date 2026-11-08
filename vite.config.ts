import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuración de Vite para Nubi (SPA React con TypeScript estricto)
export default defineConfig({
  plugins: [react()],
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
