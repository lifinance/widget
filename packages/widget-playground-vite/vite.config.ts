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
    open: true,
  },
})
