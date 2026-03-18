import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  oxc: {
    target: 'esnext',
  },
  build: {
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
})
