import type { Locator, Page } from '@playwright/test'

/**
 * WidgetExchange — Component Object for the widget's main Exchange view.
 */

export class WidgetExchange {
  readonly page: Page

  readonly widgetRoot: Locator
  /** Main title paragraph in the widget header. Not visible in Swap or Bridge mode (replaced by split tabs). */
  readonly heading: Locator
  /** Swap / Bridge tab strip — only present in Swap or Bridge mode. */
  readonly splitTabs: Locator
  /** Interactive arrow button between From and To. Hidden (replaced by spacer) in Refuel mode. */
  readonly reverseTokensButton: Locator
  /**
   * Search input inside the chain sidebar expansion panel (Wide variant only).
   * Present in the DOM only while the sidebar is open — reliable open/closed indicator.
   * When chain sidebar is disabled the inline ChainSelect (tile row) shows instead,
   * which has no search input, so this locator is absent in that case too.
   */
  readonly chainSidebar: Locator
  readonly settingsButton: Locator
  readonly fromButton: Locator
  readonly toButton: Locator
  readonly sendAmountInput: Locator

  constructor(page: Page) {
    this.page = page
    this.widgetRoot = page.locator('[id^="widget-app-expanded-container"]')
    this.heading = this.widgetRoot.locator('header p')
    this.splitTabs = this.widgetRoot.getByRole('tablist', {
      name: 'tabs',
      exact: true,
    })
    this.reverseTokensButton = this.widgetRoot.getByTestId(
      'widget-reverse-tokens-button'
    )
    this.chainSidebar = this.widgetRoot.getByPlaceholder('Search network')

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
