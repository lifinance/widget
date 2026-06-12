import type { Locator, Page } from '@playwright/test'

/**
 * WidgetView — Component Object for the widget's main view.
 */

export class WidgetView {
  readonly page: Page

  readonly root: Locator
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
  /**
   * Floating toggle button shown in Drawer variant only ("Exchange on LI.FI").
   * Lives outside the widget's MUI Drawer — always visible in Drawer mode regardless
   * of whether the drawer is open or closed.
   */
  readonly toggleDrawerButton: Locator
  readonly settingsButton: Locator
  readonly fromButton: Locator
  readonly toButton: Locator
  readonly sendAmountInput: Locator
  /**
   * "Connect wallet" button rendered by WalletHeader in the widget's top AppBar.
   * Only present when internal wallet management is active (Internal mode, Partial mode,
   * or External mode with Force internal wallets enabled).
   */
  readonly walletHeaderButton: Locator
  /**
   * The main transaction action button (BaseTransactionButton) at the bottom of the
   * exchange form. Shows "Connect wallet" when no wallet is connected. In external /
   * partial modes clicking it invokes the app's onConnect handler instead of the
   * internal wallet menu.
   */
  readonly transactionButton: Locator
  /**
   * Wallet icon button at the bottom-right of the exchange form that navigates
   * to the Send to wallet page inside the widget.
   */
  readonly sendToWalletButton: Locator
  /**
   * Close / disconnect button rendered in the widget navigation header when
   * External wallet management is active WITHOUT Force internal wallets.
   * Uses data-testid="widget-close-drawer-button" (icon-only button, no stable text).
   * Absent in Internal, Partial, and External+ForceInternal modes.
   */
  readonly closeDrawerButton: Locator
  /**
   * Reown AppKit web component button shown in the playground toolbar when
   * external wallet management is active (External or Partial mode).
   * Lives outside the widget itself.
   */
  readonly appkitButton: Locator
  /**
   * Reown AppKit modal web component (w3m-modal). Absent from the DOM until
   * the external onConnect handler calls AppKit's open(). Becomes visible
   * immediately after that call fires.
   */
  readonly appkitModal: Locator
  /**
   * Content container of the internal wallet selection modal/drawer.
   * Present in the DOM only while the internal wallet menu is open.
   */
  readonly walletModalContent: Locator
  /**
   * Heading of the internal wallet modal (MUI DialogTitle renders as h2).
   * Lives outside #widget-wallet-modal-content in the same dialog, so it
   * is scoped via getByRole('dialog') rather than the content container.
   */
  readonly walletModalHeading: Locator
  /**
   * Root container of the WidgetSkeleton loading preview
   * (data-testid="widget-skeleton-container"). Present only while the playground's
   * "Loading preview" toggle is on; the skeleton replaces the live widget, so this
   * is a direct signal that the loading state is rendered. Page-scoped because the
   * skeleton wrapper does NOT carry the widget-app-expanded-container id.
   */
  readonly skeletonContainer: Locator

  constructor(page: Page) {
    this.page = page
    this.root = page.locator('[id^="widget-app-expanded-container"]')
    this.heading = this.root.locator('header p')
    this.splitTabs = this.root.getByRole('tablist', {
      name: 'tabs',
      exact: true,
    })
    this.reverseTokensButton = this.root.getByTestId(
      'widget-reverse-tokens-button'
    )
    this.chainSidebar = this.root.getByPlaceholder('Search network')
    // getByRole respects aria-hidden; when the MUI Drawer is open it sets aria-hidden on
    // the background DOM, making getByRole unable to resolve this button. getByTestId uses
    // a CSS attribute selector which ignores aria-hidden — so it works in both states.
    this.toggleDrawerButton = page.getByTestId(
      'playground-toggle-drawer-button'
    )

    this.settingsButton = this.root.getByRole('button', {
      name: 'Settings',
      exact: true,
    })

    this.fromButton = this.root.getByRole('button', { name: /^From\b/i })
    this.toButton = this.root.getByRole('button', { name: /^To\b/i })

    this.sendAmountInput = this.root.getByRole('textbox', { name: '0' })

    // WalletHeader renders its AppBar as <header>; scoping to [id^="widget-header"]
    // reliably targets only the header wallet button even when the body button is also visible.
    this.walletHeaderButton = page
      .locator('[id^="widget-header"]')
      .getByRole('button', { name: 'Connect wallet', exact: true })

    // Icon-only button — located by data-testid to avoid depending on translated text.
    // Only present in External mode without Force internal wallets.
    this.closeDrawerButton = page.getByTestId('widget-close-drawer-button')

    this.transactionButton = this.root.getByTestId('widget-transaction-button')

    this.sendToWalletButton = this.root.getByLabel('Send to a different wallet')

    // appkit-button is a Reown AppKit web component rendered in the playground toolbar,
    // outside the widget itself — scoped to the full page, not root.
    this.appkitButton = page.locator('appkit-button')

    // w3m-modal is absent from the DOM until AppKit's open() is called.
    this.appkitModal = page.locator('w3m-modal')

    this.skeletonContainer = page.getByTestId('widget-skeleton-container')

    this.walletModalContent = page.locator('#widget-wallet-modal-content')

    // MUI DialogTitle renders as <h2>; the title is a sibling of DialogContent in the
    // same MUI Dialog, not a child of #widget-wallet-modal-content.
    this.walletModalHeading = page
      .getByRole('dialog')
      .getByRole('heading', { name: 'Select a wallet', exact: true })
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
