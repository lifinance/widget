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
  /** "Recent searches" band header. Absent when the band is empty or hidden. */
  readonly recentSearchesHeader: Locator
  /** The first recent row: it carries the band header and "Clear" too. */
  readonly firstRecentTokenItem: Locator
  /** "Clear" action in the Recent searches header. */
  readonly clearRecentsButton: Locator
  /** "Show N more" / "Show less" toggle below the last visible recent row. */
  readonly recentTokensToggle: Locator

  constructor(page: Page) {
    this.page = page

    const root = page.locator('[id^="widget-app-expanded-container"]')
    this.heading = root.getByText(/^Exchange (from|to)$/i)
    this.tokenList = root.getByRole('list').first()
    this.firstTokenItem = this.tokenList.getByRole('listitem').first()
    this.searchInput = root.getByPlaceholder('Search by token or address')
    this.allNetworksButton = root.getByRole('button', { name: 'All networks' })
    this.recentSearchesHeader = root.getByText('Recent searches', {
      exact: true,
    })
    this.firstRecentTokenItem = root
      .getByRole('listitem')
      .filter({ hasText: 'Recent searches' })
    // Scoped to the band: the search input has its own "Clear" adornment.
    this.clearRecentsButton = this.firstRecentTokenItem.getByRole('button', {
      name: 'Clear',
    })
    this.recentTokensToggle = root.getByRole('button', {
      name: /Show \d+ more|Show less/,
    })
  }

  /**
   * Read the persisted recent-search list.
   * Asserting on storage keeps the check independent of how the band renders.
   */
  async getRecentTokens(): Promise<
    Array<{ chainId: number; address: string }>
  > {
    return this.page.evaluate(() => {
      const raw = localStorage.getItem('li.fi-recent-tokens')
      return raw ? (JSON.parse(raw).state?.recentTokens ?? []) : []
    })
  }

  /** Replace the persisted recent-search list; reload the page to hydrate it. */
  async seedRecentTokens(
    recentTokens: Array<{
      chainId: number
      address: string
      symbol: string
      name: string
      decimals: number
    }>
  ): Promise<void> {
    await this.page.evaluate((tokens) => {
      localStorage.setItem(
        'li.fi-recent-tokens',
        JSON.stringify({ state: { recentTokens: tokens }, version: 0 })
      )
    }, recentTokens)
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

  /** The token button in a row, excluding the band's "Clear" and toggle. */
  private tokenButton(row: Locator): Locator {
    return row
      .getByRole('button')
      .filter({ hasNotText: /^(Clear|Show \d+ more|Show less)$/ })
      .first()
  }

  /**
   * Click the first token row in the list.
   * Clicking selects the token and auto-navigates back to the Exchange view.
   */
  async selectFirstToken(): Promise<void> {
    await this.tokenButton(this.tokenList.getByRole('listitem').first()).click()
  }

  /**
   * Click the first row of the Recent searches band.
   * The list can lead with the native token, so the first row is not always
   * a band row.
   */
  async selectFirstRecentToken(): Promise<void> {
    await this.tokenButton(this.firstRecentTokenItem).click()
  }

  /** Hover the first band row until its delete action shows, then click it. */
  async removeFirstRecentToken(): Promise<void> {
    await this.tokenButton(this.firstRecentTokenItem).hover()
    await this.firstRecentTokenItem
      .getByRole('button', { name: 'Delete', exact: true })
      .click()
  }

  /**
   * Click the token row at the given zero-based index.
   * Use index > 0 to select a different token from the From selection.
   */
  async selectTokenByIndex(index: number): Promise<void> {
    await this.tokenButton(
      this.tokenList.getByRole('listitem').nth(index)
    ).click()
  }
}
