import { expect, test } from '../fixtures/base.fixture.js'

/**
 * NFT profile — widget with subvariant NFT checkout UI.
 *
 * Covers 1 example: nft-checkout.
 *
 * The widget root is present (confirmed via investigation). The heading is
 * "Checkout" rather than "Exchange". "NFT listing not found" is expected when
 * no NFT params are in the URL — that is normal for this test scenario.
 */

test.describe('NFT checkout widget smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('widget root is visible', async ({ page }) => {
    await expect(
      page.locator('[id^="widget-app-expanded-container"]')
    ).toBeVisible()
  })

  test('Checkout heading is rendered', async ({ page }) => {
    const widgetRoot = page.locator('[id^="widget-app-expanded-container"]')
    await expect(
      widgetRoot.locator('p', { hasText: /^Checkout$/ })
    ).toBeVisible()
  })

  test('"Pay with" section is visible', async ({ page }) => {
    const widgetRoot = page.locator('[id^="widget-app-expanded-container"]')
    await expect(widgetRoot.getByText(/Pay with/i)).toBeVisible()
  })

  test('no error boundary is triggered', async ({ page }) => {
    await expect(page.getByText('Something went wrong')).toHaveCount(0)
  })
})
