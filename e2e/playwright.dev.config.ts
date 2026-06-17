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
  // A smoke suite should not be flaky: a single CI retry is enough to ride out a transient
  // hiccup without masking a real, reproducible break.
  retries: isCI ? 1 : 0,
  // CI also emits a JSON report (for the failure summary comment) and an HTML report
  // (uploaded as an artifact on failure) into a dev-smoke-specific folder.
  reporter: isCI
    ? [
        ['list'],
        ['json', { outputFile: 'dev-smoke-report.json' }],
        [
          'html',
          { outputFolder: 'playwright-report-dev-smoke', open: 'never' },
        ],
      ]
    : [['list'], ['html', { open: 'never' }]],
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
