import { defineConfig } from '@playwright/test'

// Minimal config used only by `playwright merge-reports` in CI.
// Declares both reporters with explicit output paths so the merge step
// does not depend on PLAYWRIGHT_HTML_REPORT / PLAYWRIGHT_JSON_OUTPUT_FILE
// env var support, which varies across playwright vs @playwright/test distributions.
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
  ],
})
