import { expect, test } from '../fixtures/base.fixture.js'

// The minimum allowed height value, derived from `defaultMaxHeight` in @lifi/widget.
const MIN_HEIGHT = 686

test.describe('Playground settings — Height (Default)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  test('Default (fit content) is the initial height mode', async ({
    sidebar,
  }) => {
    await test.step('Height nav button shows "Default"', async () => {
      await expect(sidebar.nav.height).toContainText('Default')
    })

    await test.step('Default card is selected in the height panel', async () => {
      await sidebar.nav.height.click()
      await expect(sidebar.heightEditor.cards.default).toBeVisible()
    })
  })

  test('Default (fill viewport) label appears in Drawer variant', async ({
    sidebar,
  }) => {
    await test.step('switch to Drawer variant', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      await sidebar.page.keyboard.press('Escape')
      await sidebar.goBack()
    })

    await test.step('open height panel', async () => {
      await sidebar.nav.height.click()
    })

    await test.step('default card shows "fill viewport" copy', async () => {
      await expect(sidebar.heightEditor.cards.default).toContainText(
        'Default (fill viewport)'
      )
    })
  })
})

test.describe('Playground settings — Height (Restricted height)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.height.click()
  })

  test('card is enabled in the default Wide variant', async ({ sidebar }) => {
    await expect(sidebar.heightEditor.cards.restrictedHeight).not.toHaveClass(
      /Mui-disabled/
    )
  })

  test('card is enabled in Compact variant', async ({ sidebar }) => {
    await test.step('switch to Compact variant', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await expect(sidebar.heightEditor.cards.restrictedHeight).not.toHaveClass(
      /Mui-disabled/
    )
  })

  test('card is disabled in Drawer variant', async ({ sidebar }) => {
    await test.step('switch to Drawer variant', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      await sidebar.page.keyboard.press('Escape')
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await expect(sidebar.heightEditor.cards.restrictedHeight).toHaveClass(
      /Mui-disabled/
    )
  })

  test('selecting it reveals the height input', async ({ sidebar }) => {
    await test.step('click Restricted height card', async () => {
      await sidebar.heightEditor.cards.restrictedHeight.click()
    })

    await test.step('height input and clear button become visible', async () => {
      await expect(sidebar.heightEditor.setHeightInput).toBeVisible()
      await expect(sidebar.heightEditor.clearHeight).toBeVisible()
    })
  })

  test('nav button reflects the selection', async ({ sidebar }) => {
    await sidebar.heightEditor.cards.restrictedHeight.click()
    await sidebar.goBack()
    await expect(sidebar.nav.height).toContainText('Restricted height')
  })

  test('a height value >= 686 is applied to the widget container', async ({
    page,
    sidebar,
  }) => {
    await test.step('select Restricted height', async () => {
      await sidebar.heightEditor.cards.restrictedHeight.click()
    })

    await test.step(`fill in ${MIN_HEIGHT + 114} (valid, above minimum)`, async () => {
      await sidebar.heightEditor.setHeightInput.fill('800')
    })

    await test.step('widget container height updates to 800px', async () => {
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).toHaveCSS('height', '800px')
    })
  })

  test('a value below the minimum is reset to empty on blur', async ({
    sidebar,
  }) => {
    await test.step('select Restricted height', async () => {
      await sidebar.heightEditor.cards.restrictedHeight.click()
    })

    await test.step('fill a value below the 686px minimum', async () => {
      await sidebar.heightEditor.setHeightInput.fill('500')
    })

    await test.step('blur the input', async () => {
      await sidebar.heightEditor.setHeightInput.blur()
    })

    await test.step('input is cleared', async () => {
      await expect(sidebar.heightEditor.setHeightInput).toHaveValue('')
    })
  })

  test('decimal input is truncated to a whole number', async ({ sidebar }) => {
    await test.step('select Restricted height', async () => {
      await sidebar.heightEditor.cards.restrictedHeight.click()
    })

    await test.step('fill a decimal value', async () => {
      await sidebar.heightEditor.setHeightInput.fill('800.7')
    })

    await test.step('displayed value is truncated to the integer part', async () => {
      await expect(sidebar.heightEditor.setHeightInput).toHaveValue('800')
    })
  })

  test('Clear button removes the height value', async ({ sidebar }) => {
    await test.step('select Restricted height and enter a value', async () => {
      await sidebar.heightEditor.cards.restrictedHeight.click()
      await sidebar.heightEditor.setHeightInput.fill('800')
    })

    await test.step('click the Clear button', async () => {
      await sidebar.heightEditor.clearHeight.click()
    })

    await test.step('input is cleared', async () => {
      await expect(sidebar.heightEditor.setHeightInput).toHaveValue('')
    })
  })

  test('686 is the minimum accepted value and is applied as height CSS', async ({
    page,
    sidebar,
  }) => {
    await test.step('select Restricted height', async () => {
      await sidebar.heightEditor.cards.restrictedHeight.click()
    })

    await test.step('fill in 686 (the minimum allowed value)', async () => {
      await sidebar.heightEditor.setHeightInput.fill('686')
    })

    await test.step('widget container height updates to 686px', async () => {
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).toHaveCSS('height', '686px')
    })
  })

  test('Clear button removes the height CSS from the widget container', async ({
    page,
    sidebar,
  }) => {
    await test.step('select Restricted height and enter 800', async () => {
      await sidebar.heightEditor.cards.restrictedHeight.click()
      await sidebar.heightEditor.setHeightInput.fill('800')
    })

    await test.step('widget container has height: 800px', async () => {
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).toHaveCSS('height', '800px')
    })

    await test.step('click the Clear button', async () => {
      await sidebar.heightEditor.clearHeight.click()
    })

    await test.step('height CSS is no longer 800px on the widget container', async () => {
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).not.toHaveCSS('height', '800px')
    })
  })
})

test.describe('Playground settings — Height (Restricted max height)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.height.click()
  })

  test('card is enabled in the default Wide variant', async ({ sidebar }) => {
    await expect(
      sidebar.heightEditor.cards.restrictedMaxHeight
    ).not.toHaveClass(/Mui-disabled/)
  })

  test('card is enabled in Compact variant', async ({ sidebar }) => {
    await test.step('switch to Compact variant', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await expect(
      sidebar.heightEditor.cards.restrictedMaxHeight
    ).not.toHaveClass(/Mui-disabled/)
  })

  test('card is disabled in Drawer variant', async ({ sidebar }) => {
    await test.step('switch to Drawer variant', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      await sidebar.page.keyboard.press('Escape')
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await expect(sidebar.heightEditor.cards.restrictedMaxHeight).toHaveClass(
      /Mui-disabled/
    )
  })

  test('selecting it reveals the max height input', async ({ sidebar }) => {
    await test.step('click Restricted max height card', async () => {
      await sidebar.heightEditor.cards.restrictedMaxHeight.click()
    })

    await test.step('max height input and clear button become visible', async () => {
      await expect(sidebar.heightEditor.setMaxHeightInput).toBeVisible()
      await expect(sidebar.heightEditor.clearMaxHeight).toBeVisible()
    })
  })

  test('nav button reflects the selection', async ({ sidebar }) => {
    await sidebar.heightEditor.cards.restrictedMaxHeight.click()
    await sidebar.goBack()
    await expect(sidebar.nav.height).toContainText('Restricted max height')
  })

  test('a max height value >= 686 is applied to the widget container', async ({
    page,
    sidebar,
  }) => {
    await test.step('select Restricted max height', async () => {
      await sidebar.heightEditor.cards.restrictedMaxHeight.click()
    })

    await test.step('fill in 800 (valid, above minimum)', async () => {
      await sidebar.heightEditor.setMaxHeightInput.fill('800')
    })

    await test.step('widget relative container max-height updates to 800px', async () => {
      await expect(page.locator('[id^="widget-relative-container"]')).toHaveCSS(
        'max-height',
        '800px'
      )
    })
  })

  // NOTE: input-validation behaviour (below-minimum blur reset, decimal truncation,
  // Clear empties the input) is identical to the Restricted height case — both render the
  // same HeightControl bound to the same heightValue state. It is verified once in the
  // Restricted height describe and intentionally not mirrored here. Only the max-height
  // CSS application (different container / property) is asserted below.

  test('Clear button removes the max-height CSS from the widget container', async ({
    page,
    sidebar,
  }) => {
    await test.step('select Restricted max height and enter 800', async () => {
      await sidebar.heightEditor.cards.restrictedMaxHeight.click()
      await sidebar.heightEditor.setMaxHeightInput.fill('800')
    })

    await test.step('widget relative container has max-height: 800px', async () => {
      await expect(page.locator('[id^="widget-relative-container"]')).toHaveCSS(
        'max-height',
        '800px'
      )
    })

    await test.step('click the Clear button', async () => {
      await sidebar.heightEditor.clearMaxHeight.click()
    })

    await test.step('max-height CSS is no longer 800px on the widget container', async () => {
      await expect(
        page.locator('[id^="widget-relative-container"]')
      ).not.toHaveCSS('max-height', '800px')
    })
  })
})

test.describe('Playground settings — Height (Full height)', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
    await sidebar.nav.height.click()
  })

  test('card is disabled in the default Wide variant', async ({ sidebar }) => {
    await expect(sidebar.heightEditor.cards.fullHeight).toHaveClass(
      /Mui-disabled/
    )
  })

  test('card is enabled in Compact variant', async ({ sidebar }) => {
    await test.step('switch to Compact variant', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await expect(sidebar.heightEditor.cards.fullHeight).not.toHaveClass(
      /Mui-disabled/
    )
  })

  test('card is disabled in Drawer variant', async ({ sidebar }) => {
    await test.step('switch to Drawer variant', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      await sidebar.page.keyboard.press('Escape')
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await expect(sidebar.heightEditor.cards.fullHeight).toHaveClass(
      /Mui-disabled/
    )
  })

  test('selecting it sets the nav button to Full height', async ({
    sidebar,
  }) => {
    await test.step('switch to Compact variant so Full height is enabled', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await test.step('click Full height card', async () => {
      await sidebar.heightEditor.cards.fullHeight.click()
    })

    await test.step('go back — nav button reflects Full height', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.height).toContainText('Full height')
    })
  })

  test('widget container stretches to fill its parent', async ({
    page,
    sidebar,
  }) => {
    await test.step('switch to Compact variant so Full height is enabled', async () => {
      await sidebar.goBack()
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
      await sidebar.nav.height.click()
    })

    await test.step('click Full height card', async () => {
      await sidebar.heightEditor.cards.fullHeight.click()
    })

    // Full height spreads { display: 'flex', height: '100%' } onto RelativeContainer.
    // In all other height modes RelativeContainer has no display override (block).
    await test.step('RelativeContainer switches to flex display', async () => {
      await expect(page.locator('[id^="widget-relative-container"]')).toHaveCSS(
        'display',
        'flex'
      )
    })
  })
})

test.describe('Playground settings — Height (Reset)', () => {
  test('Reset button returns height to Default', async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('open height panel and select Restricted height', async () => {
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.restrictedHeight.click()
    })

    await test.step('click Reset height', async () => {
      await sidebar.heightEditor.reset.click()
    })

    await test.step('nav button shows Default again', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.height).toContainText('Default')
    })
  })

  test('Reset button returns height to Default from Restricted max height', async ({
    page,
    sidebar,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('open height panel and select Restricted max height', async () => {
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.restrictedMaxHeight.click()
    })

    await test.step('click Reset height', async () => {
      await sidebar.heightEditor.reset.click()
    })

    await test.step('nav button shows Default again', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.height).toContainText('Default')
    })
  })

  test('Reset button returns height to Default from Full height', async ({
    page,
    sidebar,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('switch to Compact variant so Full height is enabled', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.compact.click()
      await sidebar.goBack()
    })

    await test.step('open height panel and select Full height', async () => {
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.fullHeight.click()
    })

    await test.step('click Reset height', async () => {
      await sidebar.heightEditor.reset.click()
    })

    await test.step('nav button shows Default again', async () => {
      await sidebar.goBack()
      await expect(sidebar.nav.height).toContainText('Default')
    })
  })
})

test.describe('Playground settings — Height (Drawer variant)', () => {
  test('Restricted height and max height inputs are absent when Drawer variant is active', async ({
    page,
    sidebar,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('switch to Drawer variant', async () => {
      await sidebar.nav.variant.click()
      await sidebar.variantEditor.cards.drawer.click()
      await sidebar.page.keyboard.press('Escape')
      await sidebar.goBack()
    })

    await test.step('open height panel', async () => {
      await sidebar.nav.height.click()
    })

    // In Drawer variant, Restricted height and Restricted max height cards are disabled
    // (Mui-disabled). The height/max-height inputs are conditionally rendered only when
    // those cards are selected — since they cannot be selected, the inputs never appear.
    await test.step('height input is not attached to DOM', async () => {
      await expect(sidebar.heightEditor.setHeightInput).not.toBeAttached()
    })

    await test.step('max height input is not attached to DOM', async () => {
      await expect(sidebar.heightEditor.setMaxHeightInput).not.toBeAttached()
    })
  })
})

test.describe('Playground settings — Height (Docs link)', () => {
  test('"Read docs" link opens the Height docs in a new tab', async ({
    page,
    sidebar,
    context,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('open height panel', async () => {
      await sidebar.nav.height.click()
    })

    await test.step('docs link is visible', async () => {
      await expect(sidebar.heightEditor.docsLink).toBeVisible()
    })

    await test.step('clicking the link opens a new tab with the correct URL', async () => {
      // Start listening for the new page before clicking so the event isn't missed.
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        sidebar.heightEditor.docsLink.click(),
      ])
      await newPage.waitForLoadState('domcontentloaded')
      expect(newPage.url()).toBe(
        'https://docs.li.fi/widget/select-widget-layout#height'
      )
    })
  })
})

// Regression for EMB-421 (PR #766): selectedLayoutId was stored in ephemeral Zustand store
// and not persisted. On reload it reset to 'default' even when a restricted height was
// configured.
test.describe('Playground settings — Height (EMB-421 regression)', () => {
  test('restricted height persists the nav label and CSS after page reload', async ({
    page,
    sidebar,
  }) => {
    await page.goto('/')
    await sidebar.resetAll()

    await test.step('set Restricted height to 800px', async () => {
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.restrictedHeight.click()
      await sidebar.heightEditor.setHeightInput.fill('800')
    })

    await test.step('widget container has height: 800px before reload', async () => {
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).toHaveCSS('height', '800px')
    })

    await test.step('reload the page', async () => {
      await page.reload()
    })

    await test.step('nav button still shows Restricted height after reload', async () => {
      await expect(sidebar.nav.height).toContainText('Restricted height')
    })

    await test.step('height: 800px CSS is still applied after reload', async () => {
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).toHaveCSS('height', '800px')
    })
  })
})
