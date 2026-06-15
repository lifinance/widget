import { expect, test } from '../fixtures/base.fixture.js'

test.describe('Playground settings — general', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('sidebar logo and header are visible', async ({ sidebar }) => {
    await test.step('LI.FI logo is rendered', async () => {
      await expect(sidebar.header.logo).toBeVisible()
    })

    await test.step('"PLAYGROUND" header text is visible', async () => {
      await expect(sidebar.header.playgroundText).toBeVisible()
    })
  })

  test('collapses and re-opens the sidebar via the close/open tools buttons', async ({
    sidebar,
  }) => {
    await test.step('sidebar is visible initially', async () => {
      await expect(sidebar.header.playgroundText).toBeVisible()
    })

    await test.step('clicking "Close tools" collapses the sidebar', async () => {
      await sidebar.header.closeTools.click()
      await expect(sidebar.header.playgroundText).not.toBeVisible()
      await expect(sidebar.header.openTools).toBeVisible()
    })

    await test.step('clicking "Open tools" restores the sidebar', async () => {
      await sidebar.header.openTools.click()
      await expect(sidebar.header.playgroundText).toBeVisible()
      await expect(sidebar.header.openTools).not.toBeVisible()
    })
  })

  test('resets the full config via the global Reset config button', async ({
    sidebar,
  }) => {
    await test.step('open the theme editing panel', async () => {
      await sidebar.nav.theme.click()
      await sidebar.nav.themePresets.editDefault.click()
    })

    // Tabs are icon-only (sun = light, moon = dark), so select by position.
    const lightTab = sidebar.themeEditor.paletteModeTablist
      .getByRole('tab')
      .nth(0)
    const darkTab = sidebar.themeEditor.paletteModeTablist
      .getByRole('tab')
      .nth(1)

    await test.step('color palette — switch to dark mode', async () => {
      await darkTab.click()
      await expect(darkTab).toHaveAttribute('aria-selected', 'true')
    })

    // MUI Switch adds the inner checkbox (role="switch") reflects checked state — use toBeChecked() on the inner input.
    await test.step('widget surface — enable border', async () => {
      await sidebar.themeEditor.widgetBorder.click()
      await expect(
        sidebar.themeEditor.widgetBorder.locator('input')
      ).toBeChecked()
    })

    await test.step('card surface — enable drop shadow', async () => {
      await sidebar.themeEditor.cardDropShadow.click()
      await expect(
        sidebar.themeEditor.cardDropShadow.locator('input')
      ).toBeChecked()
    })

    await test.step('button surface — enable border', async () => {
      await sidebar.themeEditor.buttonBorder.click()
      await expect(
        sidebar.themeEditor.buttonBorder.locator('input')
      ).toBeChecked()
    })

    await test.step('global Reset config reverts all changes', async () => {
      await sidebar.resetAll()
      // Re-enter the theme editor to assert the reverted state.
      await sidebar.nav.themePresets.editDefault.click()
      await expect(lightTab).toHaveAttribute('aria-selected', 'true')
      await expect(
        sidebar.themeEditor.widgetBorder.locator('input')
      ).not.toBeChecked()
      await expect(
        sidebar.themeEditor.cardDropShadow.locator('input')
      ).not.toBeChecked()
      await expect(
        sidebar.themeEditor.buttonBorder.locator('input')
      ).not.toBeChecked()
    })
  })

  test('Read our docs button opens the docs in a new tab', async ({
    context,
    sidebar,
  }) => {
    await test.step('"Read our docs" link is visible', async () => {
      await expect(sidebar.footer.readOurDocs).toBeVisible()
    })

    await test.step('clicking the link opens a new tab with the correct URL', async () => {
      // Start listening for the new page before clicking so the event isn't missed.
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        sidebar.footer.readOurDocs.click(),
      ])
      await newPage.waitForLoadState('domcontentloaded')
      expect(newPage.url()).toBe('https://docs.li.fi/widget/overview')
    })
  })
})
