import { defineConfig, devices } from '@playwright/test'

/**
 * LI.FI Widget E2E — Playwright configuration (preview mode)
 *
 * Runs the full playground suite against the production build at
 * http://localhost:4173 — the environment closest to what ships.
 *
 * Server lifecycle:
 *   - Local: `webServer` builds the playground and serves it automatically, so
 *     `pnpm e2e` is a single command with no manual server step.
 *   - CI: the workflow builds once and starts the preview server before the test
 *     step; `reuseExistingServer` then attaches to it and the `command` never runs
 *     (no per-shard rebuild). See .github/workflows/e2e-playground.yml.
 *
 * Dev-mode tests live in playwright.dev.config.ts (`pnpm e2e:dev`).
 */

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests',
  // Profiles run via playwright.examples.config.ts; dev-mode tests via playwright.dev.config.ts.
  testIgnore: ['**/profiles/**', '**/dev/**'],
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // 2 workers per shard: tests are I/O-bound (UI transitions, network), so a second
  // browser uses the idle CPU on a 2-vCPU CI runner without starving the first.
  workers: isCI ? 2 : undefined,
  // CI: blob (for shard merging) + list.  Local: html + list.
  reporter: isCI
    ? [['blob'], ['list']]
    : [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
      ],
  use: {
    actionTimeout: 10_000,
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    // Build the playground from source, then serve the production build. No prior
    // build is required — vite resolves @lifi/widget from source. In CI this command
    // is skipped because the preview server is already running (reuseExistingServer).
    command:
      'pnpm --filter widget-playground-vite build && pnpm --filter widget-playground-vite preview',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'preview',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],
})
