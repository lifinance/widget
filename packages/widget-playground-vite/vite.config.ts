import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// biome-ignore lint/correctness/noUnusedImports: used when testing wallet providers that require https
import mkcert from 'vite-plugin-mkcert'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // mkcert(),
    nodePolyfills(),
    react(),
  ],
  oxc: {
    target: 'esnext',
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
})
