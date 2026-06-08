import { expect, test } from '../fixtures/base.fixture.js'

// CSS custom property set by the widget's MUI theme (cssVarPrefix: 'lifi').
const WIDGET_PRIMARY_VAR = '--lifi-palette-primary-main'

test.describe('Playground settings — Persistence after reload', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('Mode: Bridge mode survives page reload', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await test.step('set Bridge mode', async () => {
      await sidebar.nav.mode.click()
      await sidebar.modeEditor.cards.bridge.click()
      await sidebar.goBack()
      await expect(exchange.heading).toHaveText('Bridge')
    })

    await test.step('reload the page', async () => {
      await page.reload()
      await page.waitForLoadState('domcontentloaded')
    })

    await test.step('Bridge mode persisted', async () => {
      await expect(sidebar.nav.mode).toContainText('Bridge')
      await expect(exchange.heading).toHaveText('Bridge')
    })
  })

  test('Variant: Compact survives page reload', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await test.step('set Compact variant', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
      await expect(sidebar.nav.variant).toContainText('Compact')
    })

    await test.step('reload the page', async () => {
      await page.reload()
      await page.waitForLoadState('domcontentloaded')
    })

    await test.step('Compact variant persisted', async () => {
      await expect(sidebar.nav.variant).toContainText('Compact')
    })

    await test.step('Compact behaviour: clicking From does not open chain sidebar', async () => {
      // In Compact variant the chain sidebar (Wide-only expansion panel) is absent —
      // clicking From opens a full-page token selector instead.
      await exchange.fromButton.click()
      await expect(exchange.chainSidebar).not.toBeVisible()
      await page.keyboard.press('Escape')
    })
  })

  test('Wallet management: External mode survives page reload', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await test.step('set External wallet management', async () => {
      await sidebar.nav.walletManagement.click()
      await sidebar.walletManagementEditor.cards.external.click()
      await sidebar.goBack()
      await expect(exchange.appkitButton).toBeAttached()
    })

    await test.step('reload the page', async () => {
      await page.reload()
      await page.waitForLoadState('domcontentloaded')
    })

    await test.step('External wallet management persisted', async () => {
      await expect(sidebar.nav.walletManagement).toContainText('External')
      // AppKit button is present when External mode is active.
      await expect(exchange.appkitButton).toBeAttached()
      // Internal wallet header button is absent in pure External mode.
      await expect(exchange.walletHeaderButton).not.toBeVisible()
    })
  })

  test('Theme: Jumper preset survives page reload', async ({
    page,
    sidebar,
  }) => {
    await test.step('select the Jumper theme', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectJumper.click()
    })

    await test.step('Jumper primary color is active before reload', async () => {
      const primary = await page.evaluate(
        (n) =>
          getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
        WIDGET_PRIMARY_VAR
      )
      // Jumper light primary: #30007A
      expect(primary.toLowerCase()).toContain('30007a')
    })

    await test.step('reload the page', async () => {
      await page.reload()
      await page.waitForLoadState('domcontentloaded')
    })

    await test.step('Jumper theme persisted', async () => {
      await expect(sidebar.nav.theme).toContainText('Jumper')
      const afterPrimary = await page.evaluate(
        (n) =>
          getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
        WIDGET_PRIMARY_VAR
      )
      expect(afterPrimary.toLowerCase()).toContain('30007a')
    })
  })
})
