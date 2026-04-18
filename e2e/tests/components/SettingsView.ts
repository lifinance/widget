import type { Locator, Page } from '@playwright/test'

/**
 * SettingsView — Component Object for the widget's Settings view.
 *
 * Opens from the Exchange view via the cog icon.
 */
export class SettingsView {
  readonly page: Page

  readonly heading: Locator
  readonly appearanceButton: Locator
  readonly languageButton: Locator
  readonly routePriorityButton: Locator
  readonly gasPriceButton: Locator
  readonly maxSlippageButton: Locator
  readonly bridgesButton: Locator
  readonly exchangesButton: Locator

  constructor(page: Page) {
    this.page = page

    const widgetRoot = page.locator('[id^="widget-app-expanded-container"]')
    this.heading = widgetRoot.locator('p', { hasText: /^Settings$/ })
    this.appearanceButton = widgetRoot.getByRole('button', {
      name: /^Appearance/i,
    })
    this.languageButton = widgetRoot.getByRole('button', { name: /^Language/i })
    this.routePriorityButton = widgetRoot.getByRole('button', {
      name: /^Route priority/i,
    })
    this.gasPriceButton = widgetRoot.getByRole('button', {
      name: /^Gas price/i,
    })
    this.maxSlippageButton = widgetRoot.getByRole('button', {
      name: /^Max\. slippage/i,
    })
    this.bridgesButton = widgetRoot.getByRole('button', { name: /^Bridges/i })
    this.exchangesButton = widgetRoot.getByRole('button', {
      name: /^Exchanges/i,
    })
  }

  /**
   * Click the back button to return to the Exchange view.
   *
   * The back button is an icon-only button that appears in the
   * widget header during sub-view navigation.
   *
   * Implementation note: Playwright's filter({ hasText: /^$/ }) matches
   * buttons where the entire text content is empty — reliable for icon buttons.
   */
  async goBack(): Promise<void> {
    // The header always contains it as the first button when in a sub-view.
    await this.page
      .locator('[id^="widget-app-expanded-container"]')
      .getByRole('button')
      .filter({ hasText: /^$/ })
      .first()
      .click()
  }
}
