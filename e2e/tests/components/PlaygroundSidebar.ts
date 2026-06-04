import type { Locator, Page } from '@playwright/test'

/**
 * PlaygroundSidebar — Component Object for the LI.FI Widget Playground left sidebar.
 *
 * The sidebar uses a nav-based layout with a header (logo + "PLAYGROUND" text),
 * nav buttons for each settings section, theme preset chips, and a footer link.
 */
export class PlaygroundSidebar {
  readonly page: Page

  // Header
  readonly logo: Locator
  readonly playgroundText: Locator
  readonly resetConfig: Locator
  readonly closeTools: Locator
  readonly openTools: Locator

  // Detail view navigation
  readonly backButton: Locator

  async goBack(): Promise<void> {
    await this.backButton.click()
    await this.playgroundText.waitFor({ state: 'visible' })
  }

  // Reset config lives in the main nav header, which is off-screen when a detail view
  // is open. Navigate back first if needed so the button is in the viewport.
  async resetAll(): Promise<void> {
    if (await this.backButton.isVisible()) {
      await this.goBack()
    }
    await this.resetConfig.click()
  }

  // Nav buttons
  readonly modeButton: Locator
  readonly variantButton: Locator
  readonly heightButton: Locator
  readonly walletManagementButton: Locator
  readonly developerControlsButton: Locator
  readonly themeButton: Locator

  // Theme preset chips
  readonly selectDefaultTheme: Locator
  readonly selectJumperTheme: Locator
  readonly selectAzureTheme: Locator
  readonly selectWatermelonTheme: Locator
  readonly selectWindows95Theme: Locator
  readonly editDefaultTheme: Locator

  // Theme editor controls (visible inside the Edit theme detail view)
  readonly paletteModeTablist: Locator
  readonly widgetBorder: Locator
  readonly cardDropShadow: Locator
  readonly buttonBorder: Locator

  // Footer
  readonly readOurDocs: Locator

  constructor(page: Page) {
    this.page = page

    this.logo = page.getByRole('img', { name: 'LI.FI' })
    this.playgroundText = page.getByText('PLAYGROUND', { exact: true })
    this.resetConfig = page.getByLabel('Reset config')
    this.closeTools = page.getByLabel('Close tools')
    this.openTools = page.getByLabel('Open tools')
    this.backButton = page.getByRole('button', { name: 'Back', exact: true })

    this.modeButton = page.getByRole('button', { name: /Mode/i, exact: false })
    this.variantButton = page.getByRole('button', {
      name: /Variant/i,
      exact: false,
    })
    this.heightButton = page.getByRole('button', {
      name: /Height/i,
      exact: false,
    })
    this.walletManagementButton = page.getByRole('button', {
      name: /Wallet management/i,
      exact: false,
    })
    this.developerControlsButton = page.getByRole('button', {
      name: /Developer controls/i,
      exact: false,
    })
    this.themeButton = page.getByRole('button', {
      name: /Theme/i,
      exact: false,
    })

    this.selectDefaultTheme = page.getByLabel('Select Default theme')
    this.selectJumperTheme = page.getByLabel('Select Jumper theme')
    this.selectAzureTheme = page.getByLabel('Select Azure theme')
    this.selectWatermelonTheme = page.getByLabel('Select Watermelon theme')
    this.selectWindows95Theme = page.getByLabel('Select Windows 95 theme')
    this.editDefaultTheme = page.getByRole('button', {
      name: 'Edit Default theme',
      exact: true,
    })

    this.paletteModeTablist = page.getByRole('tablist', {
      name: 'Palette mode',
    })
    this.widgetBorder = page.getByLabel('Widget border', { exact: true })
    this.cardDropShadow = page.getByLabel('Card drop shadow', { exact: true })
    this.buttonBorder = page.getByLabel('Button border', { exact: true })

    this.readOurDocs = page.getByRole('link', {
      name: 'Read our docs',
      exact: true,
    })
  }
}
