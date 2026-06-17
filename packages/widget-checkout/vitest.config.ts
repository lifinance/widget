import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    server: {
      deps: {
        // react-store ships an extensionless use-sync-external-store import
        // that Node ESM resolution rejects; inline the router chain so vite
        // resolves it instead.
        inline: [
          /react-i18next/,
          /@tanstack\/react-router/,
          /@tanstack\/react-store/,
        ],
      },
    },
  },
})
