import { defineConfig, devices } from '@playwright/test'

/**
 * LI.FI Widget E2E — Playwright configuration
 *
 * Server lifecycle is managed externally. Set BASE_URL to point at the running server.
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
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        baseURL: 'http://localhost:3000',
      },
    },
    {
      name: 'preview',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        baseURL: 'http://localhost:4173',
      },
    },
  ],
})
