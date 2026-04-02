import type { Locator, Page } from '@playwright/test'

/**
 * TokenSelectorView — Component Object for the widget's token selection view.
 *
 * Opens when the user clicks the From or To token button.
 */
export class TokenSelectorView {
  readonly page: Page

  readonly heading: Locator
  readonly tokenList: Locator
  readonly firstTokenItem: Locator

  constructor(page: Page) {
    this.page = page

    const widgetRoot = page.locator('[id^="widget-app-expanded-container"]')
    this.heading = widgetRoot.getByText(/^Exchange (from|to)$/i)
    this.tokenList = widgetRoot.getByRole('list').first()
    this.firstTokenItem = this.tokenList.getByRole('listitem').first()
  }

  /**
   * Click the first token row in the list.
   * Each listitem contains a single button — clicking it selects the token and
   * auto-navigates back to the Exchange view.
   */
  async selectFirstToken(): Promise<void> {
    await this.tokenList
      .getByRole('listitem')
      .first()
      .getByRole('button')
      .click()
  }

  /**
   * Click the token row at the given zero-based index.
   * Use index > 0 to select a different token from the From selection.
   */
  async selectTokenByIndex(index: number): Promise<void> {
    await this.tokenList
      .getByRole('listitem')
      .nth(index)
      .getByRole('button')
      .click()
  }
}
