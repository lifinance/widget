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

  test('a value below the minimum is reset to empty on blur', async ({
    sidebar,
  }) => {
    await test.step('select Restricted max height', async () => {
      await sidebar.heightEditor.cards.restrictedMaxHeight.click()
    })

    await test.step('fill a value below the 686px minimum', async () => {
      await sidebar.heightEditor.setMaxHeightInput.fill('500')
    })

    await test.step('blur the input', async () => {
      await sidebar.heightEditor.setMaxHeightInput.blur()
    })

    await test.step('input is cleared', async () => {
      await expect(sidebar.heightEditor.setMaxHeightInput).toHaveValue('')
    })
  })

  test('Clear button removes the max height value', async ({ sidebar }) => {
    await test.step('select Restricted max height and enter a value', async () => {
      await sidebar.heightEditor.cards.restrictedMaxHeight.click()
      await sidebar.heightEditor.setMaxHeightInput.fill('800')
    })

    await test.step('click the Clear button', async () => {
      await sidebar.heightEditor.clearMaxHeight.click()
    })

    await test.step('input is cleared', async () => {
      await expect(sidebar.heightEditor.setMaxHeightInput).toHaveValue('')
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
})
