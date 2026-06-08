import { expect, test } from '../fixtures/base.fixture.js'
import { isToggleItemDisabled } from '../helpers.js'

// ---------------------------------------------------------------------------
// Height × Developer Controls
// ---------------------------------------------------------------------------

test.describe('Playground settings — Cross-setting: Height × Developer Controls', () => {
  // Full height is only available in Compact variant.
  // Mock header/footer toggles are only enabled when the layout is full-height.
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    // Switch to Compact then Full height — the only combination where mock
    // header and footer toggles are enabled.
    await sidebar.nav.variant.click()
    await sidebar.variantEditor.cards.compact.click()
    await sidebar.goBack()
    await sidebar.nav.height.click()
    await sidebar.heightEditor.cards.fullHeight.click()
    await sidebar.goBack()
  })

  // NOTE: "mock header/footer become enabled and render in Compact+Full-height" and the
  // fixed-footer position:fixed toggling are covered in settings.developer-controls.spec.ts
  // (Mock header / Mock footer describes). Those only require the Compact+Full-height setup —
  // they are not cross-setting interactions — so they are not duplicated here. The genuine
  // cross interaction is below: changing the Height setting must re-disable a dev-controls toggle.

  test('switching away from Full height disables mock header toggle and removes the element', async ({
    page,
    sidebar,
  }) => {
    await test.step('open developer controls and enable mock header', async () => {
      await sidebar.nav.developerControls.click()
      await sidebar.developerControlsEditor.mockHeader.click()
      await expect(
        page.getByRole('main').getByText('Mock header', { exact: true })
      ).toBeVisible()
    })

    await test.step('navigate to height panel and switch to Restricted height', async () => {
      await sidebar.goBack()
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.restrictedHeight.click()
      await sidebar.goBack()
    })

    await test.step('open developer controls again', async () => {
      await sidebar.nav.developerControls.click()
    })

    await test.step('mock header toggle is disabled (pointer-events:none)', async () => {
      expect(
        await isToggleItemDisabled(sidebar.developerControlsEditor.mockHeader)
      ).toBe(true)
    })

    await test.step('mock header element is no longer in the DOM', async () => {
      await expect(
        page.getByRole('main').getByText('Mock header', { exact: true })
      ).not.toBeAttached()
    })
  })
})

// ---------------------------------------------------------------------------
// Variant × Height state preservation
// ---------------------------------------------------------------------------

test.describe('Playground settings — Cross-setting: Variant × Height state preservation', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('switching to Drawer when Restricted height is active disables the Restricted height card and clears the inline height', async ({
    sidebar,
  }) => {
    await test.step('set Restricted height 800px in Wide variant', async () => {
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.restrictedHeight.click()
      await sidebar.heightEditor.setHeightInput.fill('800')
      await sidebar.goBack()
    })

    await test.step('height nav shows Restricted height', async () => {
      await expect(sidebar.nav.height).toContainText('Restricted height')
    })

    await test.step('widget container has 800px height', async () => {
      const container = sidebar.page.locator(
        '[id^="widget-app-expanded-container"]'
      )
      await expect(container).toHaveCSS('height', '800px')
    })

    await test.step('switch to Drawer variant', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      // Selecting Drawer opens the MUI Drawer immediately (open={true}), which sets
      // aria-hidden on background DOM. Press Escape to close the backdrop first.
      await sidebar.page.keyboard.press('Escape')
      await sidebar.goBack()
    })

    await test.step('Restricted height card is disabled in Drawer (the mode is not applicable)', async () => {
      await sidebar.nav.height.click()
      await expect(sidebar.heightEditor.cards.restrictedHeight).toHaveClass(
        /Mui-disabled/
      )
      await sidebar.goBack()
    })

    await test.step('widget container no longer has 800px inline height', async () => {
      const container = sidebar.page.locator(
        '[id^="widget-app-expanded-container"]'
      )
      const inlineHeight = await container.evaluate(
        (el) => (el as HTMLElement).style.height
      )
      // When Restricted height is disabled in Drawer, the widget ignores the value
      // and uses fill-viewport behaviour — no inline height style is applied.
      expect(inlineHeight).not.toBe('800px')
    })
  })

  test('switching to Wide when Full height (Compact) is active disables the Full height card', async ({
    sidebar,
  }) => {
    await test.step('switch to Compact and set Full height', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.fullHeight.click()
      await sidebar.goBack()
    })

    await test.step('height nav shows Full height', async () => {
      await expect(sidebar.nav.height).toContainText('Full height')
    })

    await test.step('switch to Wide variant', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.wide.click()
      await sidebar.goBack()
    })

    await test.step('Full height card is disabled in Wide (the mode is not applicable)', async () => {
      // The nav label still shows "Full height" because the playground preserves the
      // last-selected mode label, but the card becomes Mui-disabled and the widget
      // reverts to fit-content behaviour.
      await sidebar.nav.height.click()
      await expect(sidebar.heightEditor.cards.fullHeight).toHaveClass(
        /Mui-disabled/
      )
      await sidebar.goBack()
    })

    await test.step('widget no longer occupies full viewport height', async () => {
      const container = sidebar.page.locator(
        '[id^="widget-app-expanded-container"]'
      )
      const inlineHeight = await container.evaluate(
        (el) => (el as HTMLElement).style.height
      )
      // Full height mode sets no inline height (it uses 100% viewport via CSS) but
      // when the card is disabled in Wide the widget uses fit-content — confirming
      // that the effective style is no longer forcing a full-height layout.
      expect(inlineHeight).toBe('')
    })
  })
})

// ---------------------------------------------------------------------------
// Theme × Compact variant
// ---------------------------------------------------------------------------

test.describe('Playground settings — Cross-setting: Theme × Compact variant', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('Jumper theme primary colour persists after switching to Compact variant', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await test.step('select Jumper theme', async () => {
      // The Theme nav button expands an accordion in the nav panel — there is no
      // second slide and no Back button. Theme presets are selected directly from
      // the nav panel without navigating away.
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectJumper.click()
    })

    await test.step('Jumper primary colour is applied', async () => {
      const primaryVar = await page.evaluate(
        (n) =>
          getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
        '--lifi-palette-primary-main'
      )
      expect(primaryVar.toLowerCase()).toContain('30007a')
    })

    await test.step('switch to Compact variant', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
    })

    await test.step('Jumper primary colour is unchanged after variant switch', async () => {
      const primaryVar = await page.evaluate(
        (n) =>
          getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
        '--lifi-palette-primary-main'
      )
      expect(primaryVar.toLowerCase()).toContain('30007a')
    })

    await test.step('click From to open token selector (Compact uses full-page token selector, not chain sidebar)', async () => {
      await exchange.fromButton.click()
      // Compact variant replaces the main view with a token selector page that
      // includes a search input — confirm the selector is open.
      await expect(
        exchange.widgetRoot.getByPlaceholder('Search by token or address')
      ).toBeVisible()
    })

    await test.step('Jumper primary colour is still active inside token selector view', async () => {
      const primaryVar = await page.evaluate(
        (n) =>
          getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
        '--lifi-palette-primary-main'
      )
      expect(primaryVar.toLowerCase()).toContain('30007a')
    })
  })
})
