import { expect, test } from '../fixtures/base.fixture.js'

/**
 * iframe profile — LiFiWidgetLight renders an <iframe> that loads the widget
 * from the default production URL (https://widget.li.fi).
 *
 * Covers 2 examples: vite-iframe, vite-iframe-wagmi.
 *
 * The widget runs inside a cross-origin iframe. Playwright accesses it via
 * frameLocator, which works across origins at the CDP level.
 * The widget fixture is scoped to `page` and cannot be used here — locators
 * are written inline against the frame.
 */

const WIDGET_ROOT = '[id^="widget-app-expanded-container"]'

test.describe('iframe widget smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('iframe is present in the DOM', async ({ page }) => {
    await expect(page.locator('iframe')).toBeVisible()
  })

  test('widget root is visible inside the iframe', async ({ page }) => {
    const frame = page.frameLocator('iframe')
    await expect(frame.locator(WIDGET_ROOT)).toBeVisible()
  })

  test('Exchange heading is visible inside the iframe', async ({ page }) => {
    const frame = page.frameLocator('iframe')
    const widgetRoot = frame.locator(WIDGET_ROOT)
    await expect(
      widgetRoot.locator('p', { hasText: /^Exchange$/ })
    ).toBeVisible()
  })

  test('Settings button is clickable inside the iframe', async ({ page }) => {
    const frame = page.frameLocator('iframe')
    const widgetRoot = frame.locator(WIDGET_ROOT)
    const settingsButton = widgetRoot.getByRole('button', {
      name: 'Settings',
      exact: true,
    })
    await expect(settingsButton).toBeVisible()
    await settingsButton.click()
    await expect(
      widgetRoot.locator('p', { hasText: /^Settings$/ })
    ).toBeVisible()
  })
})
