import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BOLT-FIX 2025-01-15: Vite-Konfiguration ohne Service Worker und mit optimierter Entwicklungsumgebung
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    global: 'globalThis',
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  // BOLT-FIX 2025-01-15: Explizit keine Service Worker-Registrierung
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});