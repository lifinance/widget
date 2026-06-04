import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
  oxc: {
    target: 'esnext',
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 5000,
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        if (
          warning.code === 'EVAL' ||
          warning.code === 'INEFFECTIVE_DYNAMIC_IMPORT' ||
          // ox ships `/*#__PURE__*/` annotations in positions Rolldown can't
          // interpret; harmless (only affects DCE hints), so silence the noise.
          warning.code === 'INVALID_ANNOTATION'
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
