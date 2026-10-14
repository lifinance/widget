import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        // react-store imports use-sync-external-store without an extension.
        inline: [/@tanstack\/react-(router|store)/],
      },
    },
  },
})
