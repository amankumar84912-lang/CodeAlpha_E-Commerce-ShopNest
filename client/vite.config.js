import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  build: {
    outDir: 'dist',
    sourcemap: false,             // No sourcemaps in production (security + size)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Function form required by Vite 8 (Rolldown bundler)
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          if (id.includes('node_modules/axios')) {
            return 'http';
          }
        },
      },
    },
  },

  server: {
    port: 5173,
    strictPort: true,
  },
}))
