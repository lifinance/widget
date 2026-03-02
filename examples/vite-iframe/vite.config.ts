import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Host-only Vite app.
// The guest (iframe) page is served by @lifi/widget-embedded (port 3000).
export default defineConfig({
  plugins: [react()],
  esbuild: {
    target: 'esnext',
  },
  server: {
    port: 4000,
    open: true,
  },
})
