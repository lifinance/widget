/** @vitest-environment happy-dom */

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const h = vi.hoisted(() => {
  const state: { captured?: Record<string, unknown> } = {}

  // A route node stub: every builder method returns the same node so the chained
  // addChildren() calls in AppDefault keep working.
  const routeNode = (options: Record<string, unknown>) => {
    const node: Record<string, unknown> = { options }
    node.addChildren = () => node
    node._addFileChildren = () => node
    node.update = () => node
    return node
  }

  return { state, routeNode }
})

vi.mock('@tanstack/react-router', () => ({
  createRootRoute: (options: Record<string, unknown>) => h.routeNode(options),
  createRoute: (options: Record<string, unknown>) => h.routeNode(options),
  createMemoryHistory: () => ({}),
  createRouter: (options: Record<string, unknown>) => {
    h.state.captured = options
    return { options }
  },
  RouterProvider: () => null,
}))

// RouterProvider is stubbed out, so no page ever renders. They are still imported, and
// their module graph reaches react-i18next, whose ESM build trips the test resolver.
// Stubbing the pages keeps this test on AppDefault's own router wiring.
vi.mock('./AppLayout.js', () => ({ AppLayout: () => null }))
vi.mock('./components/NotFound.js', () => ({ NotFound: () => null }))
vi.mock('./pages/ActivitiesPage/ActivitiesPage.js', () => ({
  ActivitiesPage: () => null,
}))
vi.mock('./pages/LanguagesPage.js', () => ({ LanguagesPage: () => null }))
vi.mock('./pages/MainPage/MainPage.js', () => ({ MainPage: () => null }))
vi.mock('./pages/RoutePriorityPage.js', () => ({
  RoutePriorityPage: () => null,
}))
vi.mock('./pages/RoutesPage/RoutesPage.js', () => ({ RoutesPage: () => null }))
vi.mock('./pages/SelectChainPage/SelectChainPage.js', () => ({
  SelectChainPage: () => null,
}))
vi.mock('./pages/SelectEnabledToolsPage.js', () => ({
  SelectEnabledToolsPage: () => null,
}))
vi.mock('./pages/SelectTokenPage/SelectTokenPage.js', () => ({
  SelectTokenPage: () => null,
}))
vi.mock('./pages/SendToWallet/BookmarksPage.js', () => ({
  BookmarksPage: () => null,
}))
vi.mock('./pages/SendToWallet/ConnectedWalletsPage.js', () => ({
  ConnectedWalletsPage: () => null,
}))
vi.mock('./pages/SendToWallet/RecentWalletsPage.js', () => ({
  RecentWalletsPage: () => null,
}))
vi.mock('./pages/SendToWallet/SendToConfiguredWalletPage.js', () => ({
  SendToConfiguredWalletPage: () => null,
}))
vi.mock('./pages/SendToWallet/SendToWalletPage.js', () => ({
  SendToWalletPage: () => null,
}))
vi.mock('./pages/SettingsPage/SettingsPage.js', () => ({
  SettingsPage: () => null,
}))
vi.mock('./pages/SettingsPage/SlippageSettings/SlippagePage.js', () => ({
  SlippagePage: () => null,
}))
vi.mock('./pages/TransactionDetailsPage/TransactionDetailsPage.js', () => ({
  TransactionDetailsPage: () => null,
}))
vi.mock('./pages/TransactionPage/TransactionPage.js', () => ({
  TransactionPage: () => null,
}))

import { AppDefault } from './AppDefault.js'

let root: Root

describe('AppDefault embedded router', () => {
  beforeEach(() => {
    h.state.captured = undefined
    const container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    await act(async () => root.unmount())
  })

  it('turns scroll restoration off so internal navigation cannot scroll the host page', async () => {
    await act(async () => root.render(<AppDefault />))

    const scrollRestoration = h.state.captured?.scrollRestoration
    expect(typeof scrollRestoration).toBe('function')

    // router-core calls this from onRendered and returns early when it is false, which is
    // what stops window.scrollTo({ top: 0, left: 0 }) from firing on every navigation.
    const shouldRestore = scrollRestoration as (opts: {
      location: unknown
    }) => boolean
    expect(shouldRestore({ location: {} })).toBe(false)
  })

  it('still creates the router on a memory history with preload by intent', async () => {
    await act(async () => root.render(<AppDefault />))

    expect(h.state.captured?.defaultPreload).toBe('intent')
    expect(h.state.captured?.history).toBeDefined()
    expect(h.state.captured?.routeTree).toBeDefined()
  })
})
