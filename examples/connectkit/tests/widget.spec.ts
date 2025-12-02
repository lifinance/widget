import { expect, test } from '@playwright/test'

test.describe('LI.FI Widget - ConnectKit Example', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the page
    await page.goto('/')
  })

  test('should render the widget', async ({ page }) => {
    // Wait for the widget to be visible
    // The widget container should be present in the DOM
    const widgetContainer = page.locator(
      '[id^="widget-app-expanded-container"]'
    )
    // TODO: Uncomment after widget release with data-testid support
    // const widgetContainer = page.getByTestId('li.fi-widget-container')
    await expect(widgetContainer).toBeVisible({ timeout: 10000 })
  })

  test('should successfully open the tokens selection page', async ({
    page,
  }) => {
    // Wait for the "From" token selection button to be visible
    // The button contains a p element with text "From"
    const fromButton = page.locator('button:has(p:has-text("From"))').first()
    // TODO: Uncomment after widget release with data-testid support
    // const fromButton = page.getByTestId('li.fi-widget-select-token-button-from')
    await expect(fromButton).toBeVisible({ timeout: 10000 })

    // Click on the token selection button
    await fromButton.click()

    // Wait for the token selection page to open
    // Verify the token list is visible, which confirms the token selection page has opened
    const tokenList = page.locator('.long-list').first()
    // TODO: Uncomment after widget release with data-testid support
    // const tokenList = page.getByTestId('li.fi-widget-token-list')
    await expect(tokenList).toBeVisible({ timeout: 10000 })
  })
})
