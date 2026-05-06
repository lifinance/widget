import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  oxc: {
    target: 'esnext',
  },

  build: {
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
