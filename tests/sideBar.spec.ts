import { expect, test } from '@playwright/test'

test.describe('Check sections inside sidebar', () => {
  test('Check sections inside sidebar', async ({ page }) => {
    await page.goto('http://localhost:3000')
    const sidebar = page.getByTestId('sidebar-container')
    await expect(sidebar).toContainText('LI.FI Widget')
  })
})
