import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// Host-only Vite app.
// The guest (iframe) page is served by @lifi/widget-embedded (port 3000).
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  esbuild: {
    target: 'esnext',
  },
  server: {
    port: 4000,
    open: true,
  },
})
