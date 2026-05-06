import { defineConfig, devices } from '@playwright/test'
import type { ExampleConfig } from './examples.config.js'
import { activeExamples } from './examples.config.js'

const PROFILE_SPEC: Record<ExampleConfig['profile'], string> = {
  standard: 'widget-smoke.spec.ts',
  routed: 'widget-smoke.spec.ts',
  iframe: 'iframe.spec.ts',
  nft: 'nft.spec.ts',
}

/**
 * LI.FI Widget E2E — Examples config
 *
 * Generates one Playwright project per active example. Server lifecycle is
 * managed externally (scripts/test-example.sh or CI) — no webServer config.
 *
 * Run a single example:  pnpm e2e:example <name>
 * Run all examples:      pnpm e2e:examples
 */

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests/profiles',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report-examples', open: 'never' }],
    ['json', { outputFile: 'test-results/examples-results.json' }],
    ['list'],
  ],
  expect: {
    timeout: 15_000,
  },
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: activeExamples.map((ex) => ({
    name: ex.name,
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 1080 },
      baseURL: `http://localhost:${ex.port}`,
    },
    testMatch: `**/${PROFILE_SPEC[ex.profile]}`,
    metadata: ex,
  })),
})
