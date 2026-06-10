import type { Page } from '@playwright/test'
import { test as base } from '@playwright/test'
import { PlaygroundSidebar } from '../components/PlaygroundSidebar.js'
import { SendToWalletView } from '../components/SendToWalletView.js'
import { SettingsView } from '../components/SettingsView.js'
import { TokenSelectorView } from '../components/TokenSelectorView.js'
import { WidgetView } from '../components/WidgetView.js'

/**
 * Wait for the widget's token list to finish loading.
 *
 * The widget fetches tokens on page load (not on selector open).
 * Pair this with page.goto() in a Promise.all to guarantee you catch
 * the response even when it arrives before the test body runs:
 *
 * ```ts
 * await Promise.all([
 *   waitForTokens(page),
 *   page.goto('/'),
 * ])
 * ```
 */
export async function waitForTokens(page: Page): Promise<void> {
  await page.waitForResponse(
    (res) => res.url().includes('/v1/tokens') && res.status() === 200
  )
}

export type WidgetFixtures = {
  /** Playground left sidebar (Design tab controls) */
  sidebar: PlaygroundSidebar
  /** Widget main view */
  widget: WidgetView
  /** Token selector view (opens when clicking From/To buttons) */
  tokenSelector: TokenSelectorView
  /** Widget settings view (opens when clicking the cog icon) */
  settings: SettingsView
  /** Widget Send to wallet page and nested Bookmarked wallets page */
  sendToWallet: SendToWalletView
}

export const test = base.extend<WidgetFixtures>({
  sidebar: async ({ page }, use) => {
    await use(new PlaygroundSidebar(page))
  },

  widget: async ({ page }, use) => {
    await use(new WidgetView(page))
  },

  tokenSelector: async ({ page }, use) => {
    await use(new TokenSelectorView(page))
  },

  settings: async ({ page }, use) => {
    await use(new SettingsView(page))
  },

  sendToWallet: async ({ page }, use) => {
    await use(new SendToWalletView(page))
  },
})

export { expect } from '@playwright/test'
