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
  /**
   * Token search input inside the token selector page.
   * Only present in Compact (and Drawer) variants — in Wide the chain sidebar
   * opens instead and this input appears after a chain is clicked.
   * Reliable open-indicator for in-widget navigation.
   */
  readonly searchInput: Locator
  /** "All networks" chip in the chain row — widens the list to every chain. */
  readonly allNetworksButton: Locator

  constructor(page: Page) {
    this.page = page

    const root = page.locator('[id^="widget-app-expanded-container"]')
    this.heading = root.getByText(/^Exchange (from|to)$/i)
    this.tokenList = root.getByRole('list').first()
    this.firstTokenItem = this.tokenList.getByRole('listitem').first()
    this.searchInput = root.getByPlaceholder('Search by token or address')
    this.allNetworksButton = root.getByRole('button', { name: 'All networks' })
  }

  /**
   * Click the "All networks" chip.
   * Picking a From token pins the To chain to that same chain, which on a
   * single-token chain (Bitcoin) leaves exactly one row — widen back first
   * whenever the test needs to select by index.
   */
  async selectAllNetworks(): Promise<void> {
    await this.allNetworksButton.click()
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
