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

  test('widget root is visible', async ({ widget }) => {
    await expect(widget.root).toBeVisible()
  })

  test('Checkout heading is rendered', async ({ widget }) => {
    await expect(
      widget.root.locator('p', { hasText: /^Checkout$/ })
    ).toBeVisible()
  })

  test('"Pay with" section is visible', async ({ widget }) => {
    await expect(widget.root.getByText(/Pay with/i)).toBeVisible()
  })

  test('no error boundary is triggered', async ({ page }) => {
    await expect(page.getByText('Something went wrong')).toHaveCount(0)
  })
})
