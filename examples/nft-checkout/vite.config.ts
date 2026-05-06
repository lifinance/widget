import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  oxc: {
    target: 'esnext',
  },
  build: {
    sourcemap: true,
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
