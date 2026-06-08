import type { Locator, Page } from '@playwright/test'
import { expect, test } from '../fixtures/base.fixture.js'

// CSS custom properties set by the playground theme provider (cssVarPrefix: 'lifi-pg').
const VIEWPORT_BG_VAR = '--lifi-pg-palette-playground-main'

// CSS custom properties set by the widget's own MUI theme (cssVarPrefix: 'lifi').
// This is the primary accent colour that changes when you switch widget themes.
const WIDGET_PRIMARY_VAR = '--lifi-palette-primary-main'

/** Read a CSS custom property from the document root. */
async function getVar(page: Page, varName: string): Promise<string> {
  return page.evaluate(
    (n) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim(),
    varName
  )
}

/**
 * Click a MUI Switch toggle and verify its state changed in either direction.
 * getByLabel resolves to the MuiSwitch-switchBase span; checked state lives on
 * the inner input[type="checkbox"][role="switch"], accessed via .locator('input').
 */
async function toggleAndVerify(toggle: Locator): Promise<void> {
  const wasOn = await toggle.evaluate(
    (el) => (el.querySelector('input') as HTMLInputElement).checked
  )
  await toggle.click()
  if (wasOn) {
    await expect(toggle.locator('input')).not.toBeChecked()
  } else {
    await expect(toggle.locator('input')).toBeChecked()
  }
}

test.describe('Playground settings — Theme', () => {
  test.beforeEach(async ({ page, sidebar }) => {
    await page.goto('/')
    await sidebar.resetAll()
  })

  // ---------------------------------------------------------------------------
  // Theme presets
  // ---------------------------------------------------------------------------

  test('Default is the initial theme', async ({ sidebar }) => {
    await test.step('Theme nav button reflects the Default selection', async () => {
      await expect(sidebar.nav.theme).toContainText('Default')
    })
  })

  test('cycling through all 5 theme presets changes the viewport background', async ({
    page,
    sidebar,
  }) => {
    await test.step('open the theme section', async () => {
      await sidebar.nav.theme.click()
    })

    const defaultBg = await getVar(page, VIEWPORT_BG_VAR)

    await test.step('Jumper changes the viewport background', async () => {
      await sidebar.nav.themePresets.selectJumper.click()
      const jumperBg = await getVar(page, VIEWPORT_BG_VAR)
      expect(jumperBg).not.toBe(defaultBg)
      await expect(sidebar.nav.themePresets.selectJumper).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    })

    await test.step('Azure changes the viewport background', async () => {
      await sidebar.nav.themePresets.selectAzure.click()
      const azureBg = await getVar(page, VIEWPORT_BG_VAR)
      expect(azureBg).not.toBe(defaultBg)
      await expect(sidebar.nav.themePresets.selectAzure).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    })

    await test.step('Watermelon changes the viewport background', async () => {
      await sidebar.nav.themePresets.selectWatermelon.click()
      const watermelonBg = await getVar(page, VIEWPORT_BG_VAR)
      expect(watermelonBg).not.toBe(defaultBg)
      await expect(sidebar.nav.themePresets.selectWatermelon).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    })

    await test.step('Windows 95 changes the viewport background', async () => {
      await sidebar.nav.themePresets.selectWindows95.click()
      const win95Bg = await getVar(page, VIEWPORT_BG_VAR)
      expect(win95Bg).not.toBe(defaultBg)
      await expect(sidebar.nav.themePresets.selectWindows95).toHaveAttribute(
        'aria-pressed',
        'true'
      )
    })

    await test.step('resetting returns the viewport background to its Default value', async () => {
      await sidebar.resetAll()
      const restoredBg = await getVar(page, VIEWPORT_BG_VAR)
      expect(restoredBg).toBe(defaultBg)
      await expect(sidebar.nav.theme).toContainText('Default')
    })
  })

  // Regression test for EMB-418 / PR #764:
  // Switching from a theme that sets a custom viewport color (e.g. Jumper → #F3EBFF) back to
  // Default via the theme card did NOT reset the background. The Default theme had no
  // playground.main color defined, so the handler wrote nothing and the Jumper color stayed.
  // Fix: add playground.main to Default config and update both light + dark modes on every switch.
  // Marked test.fail() — stays green while the bug exists, turns RED (unexpected pass) once
  // PR #764 lands, signalling that test.fail() should be removed.
  test('viewport background resets when switching from Jumper back to Default', async ({
    page,
    sidebar,
  }) => {
    test.fail()
    await test.step('open the theme section and record Default viewport background', async () => {
      await sidebar.nav.theme.click()
    })

    const defaultBg = await getVar(page, VIEWPORT_BG_VAR)

    await test.step('switch to Jumper — viewport background changes to Jumper purple', async () => {
      await sidebar.nav.themePresets.selectJumper.click()
      const jumperBg = await getVar(page, VIEWPORT_BG_VAR)
      expect(jumperBg).not.toBe(defaultBg)
    })

    await test.step('switch back to Default via the theme card', async () => {
      await sidebar.nav.themePresets.selectDefault.click()
    })

    await test.step('viewport background resets to the Default value', async () => {
      const restoredBg = await getVar(page, VIEWPORT_BG_VAR)
      expect(restoredBg).toBe(defaultBg)
    })
  })

  test('applies the Default theme preset', async ({ page, sidebar }) => {
    await test.step('select Jumper then switch back to Default', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectJumper.click()
      await sidebar.nav.themePresets.selectDefault.click()
    })

    await test.step('Default preset is active and widget primary color matches', async () => {
      await expect(sidebar.nav.themePresets.selectDefault).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      // Default light primary: #5C67FF
      expect(primary.toLowerCase()).toContain('5c67ff')
    })
  })

  test('applies the Jumper theme preset', async ({ page, sidebar }) => {
    await test.step('open the theme section and select Jumper', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectJumper.click()
    })

    await test.step('Jumper preset is active and widget primary color changes', async () => {
      await expect(sidebar.nav.themePresets.selectJumper).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      // Jumper light primary: #30007A
      expect(primary.toLowerCase()).toContain('30007a')
    })
  })

  test('applies the Azure theme preset', async ({ page, sidebar }) => {
    await test.step('open the theme section and select Azure', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectAzure.click()
    })

    await test.step('Azure preset is active and widget primary color changes', async () => {
      await expect(sidebar.nav.themePresets.selectAzure).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      // Azure light primary: #006EFF
      expect(primary.toLowerCase()).toContain('006eff')
    })
  })

  test('applies the Watermelon theme preset', async ({ page, sidebar }) => {
    await test.step('open the theme section and select Watermelon', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectWatermelon.click()
    })

    await test.step('Watermelon preset is active and widget primary color changes', async () => {
      await expect(sidebar.nav.themePresets.selectWatermelon).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      // Watermelon light primary: #f7557c
      expect(primary.toLowerCase()).toContain('f7557c')
    })
  })

  test('applies the Windows 95 theme preset', async ({ page, sidebar }) => {
    await test.step('open the theme section and select Windows 95', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectWindows95.click()
    })

    await test.step('Windows 95 preset is active and widget primary color changes', async () => {
      await expect(sidebar.nav.themePresets.selectWindows95).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      // Windows 95 light primary: #0000FF
      expect(primary.toLowerCase()).toContain('0000ff')
    })
  })

  // ---------------------------------------------------------------------------
  // Dark / light mode — system derived
  // ---------------------------------------------------------------------------

  test('Default theme: dark mode is derived from system color scheme', async ({
    page,
    sidebar,
  }) => {
    await test.step('open the theme section (Default is already selected)', async () => {
      await sidebar.nav.theme.click()
    })

    const lightBg =
      await test.step('record viewport background in light mode', async () => {
        await page.emulateMedia({ colorScheme: 'light' })
        return getVar(page, VIEWPORT_BG_VAR)
      })

    const darkBg =
      await test.step('record viewport background in dark mode', async () => {
        await page.emulateMedia({ colorScheme: 'dark' })
        // MUI detects color-scheme changes via JS (matchMedia event listener) rather than
        // pure CSS, so the CSS vars update asynchronously. Wait until the variable changes.
        await page.waitForFunction(
          ([varName, lightVal]: [string, string]) =>
            getComputedStyle(document.documentElement)
              .getPropertyValue(varName)
              .trim() !== lightVal,
          [VIEWPORT_BG_VAR, lightBg] as [string, string],
          { timeout: 5000 }
        )
        return getVar(page, VIEWPORT_BG_VAR)
      })

    await test.step('dark mode applies a different viewport background than light mode', async () => {
      expect(darkBg).not.toBe(lightBg)
    })

    // Restore to avoid affecting later steps in the same context.
    await page.emulateMedia({ colorScheme: 'light' })
  })

  test('Jumper theme: dark mode is derived from system color scheme', async ({
    page,
    sidebar,
  }) => {
    await test.step('select Jumper', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectJumper.click()
    })

    const lightPrimary =
      await test.step('record widget primary in light mode', async () => {
        await page.emulateMedia({ colorScheme: 'light' })
        return getVar(page, WIDGET_PRIMARY_VAR)
      })

    const darkPrimary =
      await test.step('record widget primary in dark mode', async () => {
        await page.emulateMedia({ colorScheme: 'dark' })
        // Wait for MUI's JS-based color scheme detection to update the CSS var.
        await page.waitForFunction(
          ([varName, lightVal]: [string, string]) =>
            getComputedStyle(document.documentElement)
              .getPropertyValue(varName)
              .trim() !== lightVal,
          [WIDGET_PRIMARY_VAR, lightPrimary] as [string, string],
          { timeout: 5000 }
        )
        return getVar(page, WIDGET_PRIMARY_VAR)
      })

    await test.step('dark mode switches Jumper to its dark palette primary color', async () => {
      // Light primary: #30007A. Dark primary: #653BA3. They must differ.
      expect(darkPrimary).not.toBe(lightPrimary)
    })

    await page.emulateMedia({ colorScheme: 'light' })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — colour palette
  // ---------------------------------------------------------------------------

  test('edits a colour in the colour palette (Light mode)', async ({
    page,
    sidebar,
  }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('Light palette tab is visible and active by default', async () => {
      await expect(sidebar.themeEditor.paletteModeTablist).toBeVisible()
      await expect(sidebar.themeEditor.paletteModeTabLight).toHaveAttribute(
        'aria-selected',
        'true'
      )
    })

    const newHex = 'FFEECC'

    await test.step('edit the Viewport background hex input', async () => {
      await sidebar.themeEditor.viewportBackgroundInput.click()
      await sidebar.themeEditor.viewportBackgroundInput.selectText()
      await sidebar.themeEditor.viewportBackgroundInput.fill(newHex)
      await sidebar.themeEditor.viewportBackgroundInput.press('Enter')
    })

    await test.step('viewport background input reflects the new value', async () => {
      await expect(sidebar.themeEditor.viewportBackgroundInput).toHaveValue(
        newHex
      )
    })

    await test.step('CSS variable is updated to the new colour', async () => {
      const bg = await getVar(page, VIEWPORT_BG_VAR)
      expect(bg.toLowerCase()).toContain('ffeecc')
    })
  })

  test('edits a colour in the colour palette (Dark mode)', async ({
    page,
    sidebar,
  }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('switch to the Dark palette tab', async () => {
      await sidebar.themeEditor.paletteModeTabDark.click()
      await expect(sidebar.themeEditor.paletteModeTabDark).toHaveAttribute(
        'aria-selected',
        'true'
      )
    })

    const newHex = '1A1A2E'

    await test.step('edit the dark-mode Viewport background hex input', async () => {
      await sidebar.themeEditor.viewportBackgroundInput.click()
      await sidebar.themeEditor.viewportBackgroundInput.selectText()
      await sidebar.themeEditor.viewportBackgroundInput.fill(newHex)
      await sidebar.themeEditor.viewportBackgroundInput.press('Enter')
    })

    await test.step('dark-mode viewport background input reflects the new value', async () => {
      await expect(sidebar.themeEditor.viewportBackgroundInput).toHaveValue(
        newHex
      )
    })

    await test.step('CSS variable updates when system dark mode is emulated', async () => {
      await page.emulateMedia({ colorScheme: 'dark' })
      // MUI updates CSS vars via a JS matchMedia listener — wait for propagation.
      await page.waitForFunction(
        (v) =>
          getComputedStyle(document.documentElement)
            .getPropertyValue(v)
            .trim()
            .toLowerCase()
            .includes('1a1a2e'),
        VIEWPORT_BG_VAR,
        { timeout: 5000 }
      )
      const bg = await getVar(page, VIEWPORT_BG_VAR)
      expect(bg.toLowerCase()).toContain('1a1a2e')
      await page.emulateMedia({ colorScheme: 'light' })
    })
  })

  test('Default and Jumper have an explicit Dark palette tab; others do not', async ({
    sidebar,
  }) => {
    await sidebar.nav.theme.click()

    await test.step('Default editor shows the Light/Dark palette tab strip', async () => {
      await sidebar.nav.themePresets.editDefault.click()
      await expect(sidebar.themeEditor.paletteModeTablist).toBeVisible()
      await expect(sidebar.themeEditor.paletteModeTabDark).toBeVisible()
      await sidebar.goBack()
    })

    await test.step('Jumper editor shows the Light/Dark palette tab strip', async () => {
      await sidebar.nav.themePresets.selectJumper.click()
      await sidebar.nav.themePresets.editJumper.click()
      await expect(sidebar.themeEditor.paletteModeTablist).toBeVisible()
      await expect(sidebar.themeEditor.paletteModeTabDark).toBeVisible()
      await sidebar.goBack()
    })

    await test.step('Azure editor has no Dark palette tab (light-only theme)', async () => {
      await sidebar.nav.themePresets.selectAzure.click()
      await sidebar.nav.themePresets.editAzure.click()
      await expect(sidebar.themeEditor.paletteModeTablist).not.toBeVisible()
      await sidebar.goBack()
    })

    await test.step('Watermelon editor has no Dark palette tab', async () => {
      await sidebar.nav.themePresets.selectWatermelon.click()
      await sidebar.nav.themePresets.editWatermelon.click()
      await expect(sidebar.themeEditor.paletteModeTablist).not.toBeVisible()
      await sidebar.goBack()
    })

    await test.step('Windows 95 editor has no Dark palette tab', async () => {
      await sidebar.nav.themePresets.selectWindows95.click()
      await sidebar.nav.themePresets.editWindows95.click()
      await expect(sidebar.themeEditor.paletteModeTablist).not.toBeVisible()
      await sidebar.goBack()
    })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — Typography
  // ---------------------------------------------------------------------------

  test('changes the font family in Typography', async ({ page, sidebar }) => {
    // The global beforeEach resets config, which clears the font selection;
    // FontAutocomplete returns null when no font is selected. Re-navigate so
    // the page initialises fresh with the default Inter selection intact.
    await page.goto('/')

    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('click font autocomplete and type "Poppins"', async () => {
      await sidebar.themeEditor.fontInput.click()
      await sidebar.themeEditor.fontInput.fill('Poppins')
    })

    await test.step('select the Poppins option from the dropdown', async () => {
      // The option label includes fallback fonts: "Poppins, sans-serif". Use a
      // regex so the assertion is resilient to different font fallback strings.
      const poppinsOption = page.getByRole('option', { name: /^Poppins/i })
      await poppinsOption.click()
    })

    await test.step('the widget heading picks up the Poppins font family', async () => {
      // Font cascades to text elements inside the widget, not the container root.
      // Use toHaveCSS so Playwright retries until the MUI theme re-render propagates.
      await expect(
        page.locator('[id^="widget-app-expanded-container"] p').first()
      ).toHaveCSS('font-family', /poppins/i)
    })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — Widget surface
  // ---------------------------------------------------------------------------

  test('edits widget surface radius, shadow, and border', async ({
    page,
    sidebar,
  }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('increase Widget corner radius by one step', async () => {
      const slider = sidebar.themeEditor.widgetCornerRadius
      const before = Number(await slider.getAttribute('aria-valuenow'))
      await slider.focus()
      await slider.press('ArrowRight')
      const after = Number(await slider.getAttribute('aria-valuenow'))
      expect(after).toBeGreaterThan(before)
    })

    await test.step('toggle Widget drop shadow and verify state changes', async () => {
      // Widget drop shadow is ON in the Default theme; toggleAndVerify handles either direction.
      await toggleAndVerify(sidebar.themeEditor.widgetDropShadow)
    })

    await test.step('enable Widget border — widget container gains a border', async () => {
      // Widget border is OFF by default; enable it and verify the visual effect.
      await sidebar.themeEditor.widgetBorder.click()
      await expect(
        sidebar.themeEditor.widgetBorder.locator('input')
      ).toBeChecked()
      // The border is applied to the widget-relative-container element.
      await expect(page.locator('[id^="widget-relative-container"]')).toHaveCSS(
        'border-style',
        'solid'
      )
    })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — Card surface
  // ---------------------------------------------------------------------------

  test('edits card surface', async ({ sidebar }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('increase Card corner radius by one step', async () => {
      const slider = sidebar.themeEditor.cardCornerRadius
      const before = Number(await slider.getAttribute('aria-valuenow'))
      await slider.focus()
      await slider.press('ArrowRight')
      const after = Number(await slider.getAttribute('aria-valuenow'))
      expect(after).toBeGreaterThan(before)
    })

    await test.step('toggle Card drop shadow and verify state changes', async () => {
      await toggleAndVerify(sidebar.themeEditor.cardDropShadow)
    })

    await test.step('toggle Card border off then back on', async () => {
      // Card border is ON by default in the Default theme.
      await toggleAndVerify(sidebar.themeEditor.cardBorder)
      // Restore to its original state.
      await toggleAndVerify(sidebar.themeEditor.cardBorder)
    })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — Button surface
  // ---------------------------------------------------------------------------

  test('edits button surface', async ({ sidebar }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('increase Button corner radius by one step', async () => {
      const slider = sidebar.themeEditor.buttonCornerRadius
      const before = Number(await slider.getAttribute('aria-valuenow'))
      await slider.focus()
      await slider.press('ArrowRight')
      const after = Number(await slider.getAttribute('aria-valuenow'))
      expect(after).toBeGreaterThan(before)
    })

    await test.step('enable Button drop shadow', async () => {
      await sidebar.themeEditor.buttonDropShadow.click()
      await expect(
        sidebar.themeEditor.buttonDropShadow.locator('input')
      ).toBeChecked()
    })

    await test.step('enable Button border', async () => {
      await sidebar.themeEditor.buttonBorder.click()
      await expect(
        sidebar.themeEditor.buttonBorder.locator('input')
      ).toBeChecked()
    })
  })

  // ---------------------------------------------------------------------------
  // Docs link (hidden inside the Edit theme detail view)
  // ---------------------------------------------------------------------------

  test('"Read docs" link in the Edit theme view points to the theme docs', async ({
    context,
    sidebar,
  }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('docs link is visible', async () => {
      await expect(sidebar.themeEditor.docsLink).toBeVisible()
    })

    await test.step('clicking it opens a new tab with the theme docs URL', async () => {
      // Start listening for the new page before clicking so the event isn't missed.
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        sidebar.themeEditor.docsLink.click(),
      ])
      await newPage.waitForLoadState('domcontentloaded')
      expect(newPage.url()).toBe(
        'https://docs.li.fi/widget/customize-widget#theme'
      )
    })
  })

  // ---------------------------------------------------------------------------
  // Reset
  // ---------------------------------------------------------------------------

  test('resets theme section to defaults', async ({ sidebar }) => {
    await test.step('open the Default theme editor and enable Widget border', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
      // Widget border is OFF by default — enabling it gives us something to verify after reset.
      await sidebar.themeEditor.widgetBorder.click()
      await expect(
        sidebar.themeEditor.widgetBorder.locator('input')
      ).toBeChecked()
    })

    await test.step('global Reset config reverts all theme changes', async () => {
      // Reset config is in the first slide panel which is off-screen while the editor is open.
      await sidebar.resetAll()
    })

    await test.step('Widget border is off again after reset', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
      await expect(
        sidebar.themeEditor.widgetBorder.locator('input')
      ).not.toBeChecked()
    })
  })

  // ---------------------------------------------------------------------------
  // Route side panel — theme inheritance
  // ---------------------------------------------------------------------------

  test('route side panel inherits the active theme', async ({
    page,
    sidebar,
    exchange,
  }) => {
    await test.step('select Jumper theme to get a visually distinct widget primary', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectJumper.click()
      // Confirm the widget CSS primary variable is Jumper's dark purple.
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      expect(primary.toLowerCase()).toContain('30007a')
      // The theme section (nav panel) is still visible but does not overlap the widget
      // in Wide variant — clicking From on the widget is possible without navigating away.
    })

    await test.step('click From — opens the chain sidebar (route side panel) in Wide variant', async () => {
      await exchange.fromButton.click()
      await expect(exchange.chainSidebar).toBeVisible()
    })

    await test.step('Jumper widget primary color is still active while the side panel is open', async () => {
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      expect(primary.toLowerCase()).toContain('30007a')
    })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — Primary color hex edit
  // ---------------------------------------------------------------------------

  test('editing the Primary color hex input updates the widget primary CSS variable', async ({
    page,
    sidebar,
  }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    const newHex = 'FF0000'

    await test.step('edit Primary color to FF0000', async () => {
      await sidebar.themeEditor.primaryColorInput.click()
      await sidebar.themeEditor.primaryColorInput.selectText()
      await sidebar.themeEditor.primaryColorInput.fill(newHex)
      await sidebar.themeEditor.primaryColorInput.press('Enter')
    })

    await test.step('Primary color input shows the new value', async () => {
      await expect(sidebar.themeEditor.primaryColorInput).toHaveValue(newHex)
    })

    await test.step('widget primary CSS variable is updated', async () => {
      const primary = await getVar(page, WIDGET_PRIMARY_VAR)
      expect(primary.toLowerCase()).toContain('ff0000')
    })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — Widget drop shadow sub-controls
  // ---------------------------------------------------------------------------

  test('Widget drop shadow is ON by default; adjusting Offset Y changes the value', async ({
    sidebar,
  }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('Widget drop shadow sub-controls are visible (shadow is ON by default)', async () => {
      // Widget drop shadow is ON in the Default theme, so the Offset Y slider is already visible.
      await expect(sidebar.themeEditor.widgetDropShadowOffsetY).toBeVisible()
    })

    await test.step('decrement Offset Y slider and verify value decreases', async () => {
      // Default Offset Y is 8 (the maximum for this slider: min -8, max 8).
      // Press ArrowLeft to decrease from the default max so the value actually changes.
      const slider = sidebar.themeEditor.widgetDropShadowOffsetY
      const before = Number(await slider.getAttribute('aria-valuenow'))
      await slider.focus()
      await slider.press('ArrowLeft')
      const after = Number(await slider.getAttribute('aria-valuenow'))
      expect(after).toBeLessThan(before)
    })
  })

  // ---------------------------------------------------------------------------
  // Theme editor — Widget border sub-controls
  // ---------------------------------------------------------------------------

  test('enabling Widget border reveals the border color and weight sub-controls', async ({
    sidebar,
  }) => {
    await test.step('open the Default theme editor', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    await test.step('Widget border is OFF by default — enable it', async () => {
      // Checked state is on the inner input[type="checkbox"][role="switch"].
      await sidebar.themeEditor.widgetBorder.click()
      await expect(
        sidebar.themeEditor.widgetBorder.locator('input')
      ).toBeChecked()
    })

    await test.step('border color hex input appears', async () => {
      await expect(sidebar.themeEditor.widgetBorderColor).toBeVisible()
    })

    await test.step('border weight input appears', async () => {
      // widgetBorderWeight is a ValueInput (numeric text field, not a slider).
      // BorderWeightRow sets aria-label="Widget border weight" via inputProps.
      await expect(sidebar.themeEditor.widgetBorderWeight).toBeVisible()
    })

    await test.step('change border weight and verify it updates', async () => {
      const weightInput = sidebar.themeEditor.widgetBorderWeight
      const before = Number(await weightInput.inputValue())
      const newValue = before < 4 ? before + 1 : before - 1
      await weightInput.fill(String(newValue))
      await weightInput.press('Enter')
      await expect(weightInput).toHaveValue(String(newValue))
    })
  })

  // ---------------------------------------------------------------------------
  // Regression: EMB-424 — theme switch replaces entire config.theme including layout
  // ---------------------------------------------------------------------------

  // Regression for EMB-424 (PR #769 open): setConfigTheme replaced the entire config.theme
  // including the user's layout container settings (e.g. height). This caused restricted-height
  // values set before switching themes to be lost after the switch.
  // Marked test.fail() — stays green while the bug exists, turns RED (unexpected pass) once
  // PR #769 lands, signalling that test.fail() should be removed.
  test("switching themes preserves the user's restricted height setting", async ({
    page,
    sidebar,
  }) => {
    test.fail()
    await test.step('set Restricted height to 800px', async () => {
      await sidebar.nav.height.click()
      await sidebar.heightEditor.cards.restrictedHeight.click()
      await sidebar.heightEditor.setHeightInput.fill('800')
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).toHaveCSS('height', '800px')
    })

    await test.step('switch to Jumper theme', async () => {
      // Navigate back first so the nav panel is visible, then open the theme section.
      await sidebar.goBack()
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.selectJumper.click()
    })

    await test.step('height CSS is preserved after theme switch', async () => {
      await expect(
        page.locator('[id^="widget-app-expanded-container"]')
      ).toHaveCSS('height', '800px')
    })

    await test.step('nav Height button still shows Restricted height', async () => {
      // goBack() closes the theme panel and returns to the nav.
      await sidebar.goBack()
      await expect(sidebar.nav.height).toContainText('Restricted height')
    })
  })
})
