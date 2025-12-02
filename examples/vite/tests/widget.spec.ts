import { expect, test } from '@playwright/test'

test.describe('LI.FI Widget - Vite Example', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto('/')
  })

  test('should render the widget without errors', async ({ page }) => {
    // Wait for the widget to be visible
    // The widget container should be present in the DOM
    const widgetContainer = page.locator(
      '[id^="widget-app-expanded-container"]'
    )
    await expect(widgetContainer).toBeVisible({ timeout: 10000 })
  })

  test('should successfully open the tokens selection page', async ({
    page,
  }) => {
    // Wait for the "From" token selection button to be visible
    // The button contains a p element with text "From"
    const fromButton = page.locator('button:has(p:has-text("From"))').first()

    await expect(fromButton).toBeVisible({ timeout: 10000 })

    // Click on the token selection button
    await fromButton.click()

    // Wait for the token selection page to open
    // Verify the token list is visible, which confirms the token selection page has opened
    const tokenList = page.locator('.long-list').first()
    await expect(tokenList).toBeVisible({ timeout: 10000 })
  })
})
