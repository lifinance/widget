import { defineConfig, devices } from '@playwright/test'

/**
 * LI.FI Widget E2E — Playwright configuration
 *
 * Targets the widget playground at http://localhost:3000 by default, or the value of BASE_URL.
 * The dev server is started automatically via webServer if not already running.
 */

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/profiles/**'],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm --filter widget-playground-vite dev',
    url: process.env.BASE_URL ?? 'http://localhost:3000',
    reuseExistingServer: !isCI,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
})
