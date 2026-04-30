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
    chunkSizeWarningLimit: 5000,
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
      },
      onwarn(warning, defaultHandler) {
        if (
          warning.code === 'EVAL' ||
          warning.code === 'INEFFECTIVE_DYNAMIC_IMPORT'
        ) {
          return
        }
        defaultHandler(warning)
      },
    },
  },
  server: {
    port: 3000,
  },
})
