import type { Locator, Page } from '@playwright/test'

/**
 * PlaygroundSidebar — Component Object for the LI.FI Widget Playground left sidebar.
 *
 * Locators are grouped by the context in which they appear:
 *   header       — always visible when the drawer is open
 *   nav          — main nav panel (first slide panel)
 *   themeEditor  — theme editor detail view (second slide panel)
 *   footer       — always visible at the bottom of the drawer
 */
export class PlaygroundSidebar {
  readonly page: Page

  readonly header: {
    logo: Locator
    playgroundText: Locator
    resetConfig: Locator
    closeTools: Locator
    openTools: Locator
  }

  readonly nav: {
    mode: Locator
    variant: Locator
    height: Locator
    walletManagement: Locator
    developerControls: Locator
    theme: Locator
    themePresets: {
      selectDefault: Locator
      selectJumper: Locator
      selectAzure: Locator
      selectWatermelon: Locator
      selectWindows95: Locator
      editDefault: Locator
    }
  }

  readonly themeEditor: {
    paletteModeTablist: Locator
    widgetBorder: Locator
    cardDropShadow: Locator
    buttonBorder: Locator
  }

  readonly footer: {
    readOurDocs: Locator
  }

  readonly backButton: Locator

  async goBack(): Promise<void> {
    await this.backButton.click()
    await this.header.playgroundText.waitFor({ state: 'visible' })
  }

  // Reset config lives in the main nav header, which is off-screen when a detail view
  // is open. Navigate back first if needed so the button is in the viewport.
  async resetAll(): Promise<void> {
    if (await this.backButton.isVisible()) {
      await this.goBack()
    }
    await this.header.resetConfig.click()
  }

  constructor(page: Page) {
    this.page = page

    this.header = {
      logo: page.getByRole('img', { name: 'LI.FI' }),
      playgroundText: page.getByText('PLAYGROUND', { exact: true }),
      resetConfig: page.getByLabel('Reset config'),
      closeTools: page.getByLabel('Close tools'),
      openTools: page.getByLabel('Open tools'),
    }

    this.nav = {
      mode: page.getByRole('button', { name: /Mode/i, exact: false }),
      variant: page.getByRole('button', { name: /Variant/i, exact: false }),
      height: page.getByRole('button', { name: /Height/i, exact: false }),
      walletManagement: page.getByRole('button', {
        name: /Wallet management/i,
        exact: false,
      }),
      developerControls: page.getByRole('button', {
        name: /Developer controls/i,
        exact: false,
      }),
      theme: page.getByRole('button', { name: /Theme/i, exact: false }),
      themePresets: {
        selectDefault: page.getByLabel('Select Default theme'),
        selectJumper: page.getByLabel('Select Jumper theme'),
        selectAzure: page.getByLabel('Select Azure theme'),
        selectWatermelon: page.getByLabel('Select Watermelon theme'),
        selectWindows95: page.getByLabel('Select Windows 95 theme'),
        editDefault: page.getByRole('button', {
          name: 'Edit Default theme',
          exact: true,
        }),
      },
    }

    this.themeEditor = {
      paletteModeTablist: page.getByRole('tablist', { name: 'Palette mode' }),
      widgetBorder: page.getByLabel('Widget border', { exact: true }),
      cardDropShadow: page.getByLabel('Card drop shadow', { exact: true }),
      buttonBorder: page.getByLabel('Button border', { exact: true }),
    }

    this.footer = {
      readOurDocs: page.getByRole('link', {
        name: 'Read our docs',
        exact: true,
      }),
    }

    this.backButton = page.getByRole('button', { name: 'Back', exact: true })
  }
}
