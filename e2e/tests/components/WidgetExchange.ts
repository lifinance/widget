import type { Locator, Page } from '@playwright/test'

/**
 * WidgetExchange — Component Object for the widget's main Exchange view.
 */

export class WidgetExchange {
  readonly page: Page

  readonly widgetRoot: Locator
  readonly heading: Locator
  readonly settingsButton: Locator
  readonly fromButton: Locator
  readonly toButton: Locator
  readonly sendAmountInput: Locator

  constructor(page: Page) {
    this.page = page
    this.widgetRoot = page.locator('[id^="widget-app-expanded-container"]')
    this.heading = this.widgetRoot.locator('p', { hasText: /^Exchange$/ })

    this.settingsButton = this.widgetRoot.getByRole('button', {
      name: 'Settings',
      exact: true,
    })

    this.fromButton = this.widgetRoot.getByRole('button', { name: /^From\b/i })
    this.toButton = this.widgetRoot.getByRole('button', { name: /^To\b/i })

    this.sendAmountInput = this.widgetRoot.getByRole('textbox', { name: '0' })
  }

  /** Open the Settings view by clicking the cog icon */
  async openSettings(): Promise<void> {
    await this.settingsButton.click()
  }

  /** Click the From token selector button to open the token selector view */
  async openFromTokenSelector(): Promise<void> {
    await this.fromButton.click()
  }

  /** Click the To token selector button to open the token selector view */
  async openToTokenSelector(): Promise<void> {
    await this.toButton.click()
  }
}
