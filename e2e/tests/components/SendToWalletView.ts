import type { Locator, Page } from '@playwright/test'

/**
 * SendToWalletView — Component Object for the widget's Send to wallet page
 * and the nested Bookmarked wallets page. Both are part of the same navigation
 * tree inside the widget, reached by clicking the wallet icon at the bottom of
 * the main widget view.
 */
export class SendToWalletView {
  readonly page: Page
  readonly root: Locator

  /** "Recent wallets" card button on the Send to wallet page. */
  readonly recentWalletsButton: Locator
  /** "Connected wallets" card button on the Send to wallet page. */
  readonly connectedWalletsButton: Locator
  /** "Bookmarked wallets" card button on the Send to wallet page. */
  readonly bookmarkedWalletsButton: Locator

  /**
   * Individual list items on the Bookmarked wallets page.
   * After seeding, this list contains 50 entries labelled "asdf 0"–"asdf 49".
   */
  readonly bookmarkItems: Locator

  constructor(page: Page) {
    this.page = page
    this.root = page.locator('[id^="widget-app-expanded-container"]')

    this.recentWalletsButton = this.root.getByRole('button', {
      name: /Recent wallets/i,
    })
    this.connectedWalletsButton = this.root.getByRole('button', {
      name: /Connected wallets/i,
    })
    this.bookmarkedWalletsButton = this.root.getByRole('button', {
      name: /Bookmarked wallets/i,
    })

    this.bookmarkItems = this.root.getByRole('listitem')
  }
}
