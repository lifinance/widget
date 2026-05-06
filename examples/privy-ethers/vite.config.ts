import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  build: {
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
      },
    },
  },
  server: {
    port: 3000,
  },
})
