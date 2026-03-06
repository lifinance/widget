import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// Host-only Vite app.
// The guest (iframe) page is served from VITE_WIDGET_URL (default: https://widget.li.fi).
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
