import { defineConfig, devices } from '@playwright/test'

/**
 * LI.FI Widget E2E — Playwright configuration (dev mode)
 *
 * Runs the smoke subset against the Vite dev server at http://localhost:3000.
 * Dev mode picks up source changes via HMR and needs no build, so it's the fast
 * loop for sanity-checking the playground during development.
 *
 * `webServer` starts `pnpm dev` automatically (and reuses an already-running one),
 * so `pnpm e2e:dev` is a single command. The full production-like suite runs in
 * preview mode via playwright.config.ts (`pnpm e2e`).
 */

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests/dev',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['list']],
  use: {
    actionTimeout: 10_000,
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm --filter widget-playground-vite dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
})
