import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type Router,
  RouterProvider,
} from '@tanstack/react-router'
import { useMemo } from 'react'
import { AppLayout } from './AppLayout.js'
import { NotFound } from './components/NotFound.js'
import { ActiveTransactionsPage } from './pages/ActiveTransactionsPage/ActiveTransactionsPage.js'
import { LanguagesPage } from './pages/LanguagesPage.js'
import { MainPage } from './pages/MainPage/MainPage.js'
import { RoutesPage } from './pages/RoutesPage/RoutesPage.js'
import { SelectChainPage } from './pages/SelectChainPage/SelectChainPage.js'
import { SelectEnabledToolsPage } from './pages/SelectEnabledToolsPage.js'
import { SelectTokenPage } from './pages/SelectTokenPage/SelectTokenPage.js'
import { BookmarksPage } from './pages/SendToWallet/BookmarksPage.js'
import { ConnectedWalletsPage } from './pages/SendToWallet/ConnectedWalletsPage.js'
import { RecentWalletsPage } from './pages/SendToWallet/RecentWalletsPage.js'
import { SendToConfiguredWalletPage } from './pages/SendToWallet/SendToConfiguredWalletPage.js'
import { SendToWalletPage } from './pages/SendToWallet/SendToWalletPage.js'
import { SettingsPage } from './pages/SettingsPage/SettingsPage.js'
import { TransactionDetailsPage } from './pages/TransactionDetailsPage/TransactionDetailsPage.js'
import { TransactionHistoryPage } from './pages/TransactionHistoryPage/TransactionHistoryPage.js'
import { TransactionPage } from './pages/TransactionPage/TransactionPage.js'
import { navigationRoutes } from './utils/navigationRoutes.js'

const rootRoute = createRootRoute({
  component: AppLayout,
  notFoundComponent: NotFound,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.home,
  component: MainPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.settings,
  component: SettingsPage,
})

// TODO: to be a child of settingsRoute, needs <Outlet /> inside SettingsPage
// Think about the visual hierarchy
const settingsBridgesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.bridges,
  component: () => <SelectEnabledToolsPage type="Bridges" />,
})

// TODO: to be a child of settingsRoute, needs <Outlet /> inside SettingsPage
// Think about the visual hierarchy
const settingsExchangesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.exchanges,
  component: () => <SelectEnabledToolsPage type="Exchanges" />,
})

// TODO: to be a child of settingsRoute, needs <Outlet /> inside SettingsPage
// Think about the visual hierarchy
const settingsLanguagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.languages,
  component: LanguagesPage,
})

const fromTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.fromToken,
  component: () => <SelectTokenPage formType="from" />,
})

const fromTokenFromChainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${navigationRoutes.fromToken}${navigationRoutes.fromChain}`,
  component: () => <SelectChainPage formType="from" />,
})

const toTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toToken,
  component: () => <SelectTokenPage formType="to" />,
})

const toTokenToChainRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: `${navigationRoutes.toToken}${navigationRoutes.toChain}`,
  component: () => <SelectChainPage formType="to" />,
})

const toTokenNativeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toTokenNative,
  component: () => <SelectChainPage formType="to" selectNativeToken={true} />,
})

const routesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.routes,
  component: RoutesPage,
})

const activeTransactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.activeTransactions,
  component: ActiveTransactionsPage,
})

const sendToWalletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.sendToWallet,
  component: SendToWalletPage,
})

// TODO: to be a child of sendToWalletRoute, needs <Outlet /> inside SendToWalletPage
// Think about the visual hierarchy
const sendToWalletBookmarksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.bookmarks,
  component: BookmarksPage,
})

// TODO: to be a child of sendToWalletRoute, needs <Outlet /> inside SendToWalletPage
// Think about the visual hierarchy
const sendToWalletRecentWalletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.recentWallets,
  component: RecentWalletsPage,
})

// TODO: to be a child of sendToWalletRoute, needs <Outlet /> inside SendToWalletPage
// Think about the visual hierarchy
const sendToWalletConnectedWalletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.connectedWallets,
  component: ConnectedWalletsPage,
})

const configuredWalletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.configuredWallets,
  component: SendToConfiguredWalletPage,
})

const transactionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionHistory,
  component: TransactionHistoryPage,
})

const transactionHistoryDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const transactionExecutionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionExecution,
  component: TransactionPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsLanguagesRoute,
  settingsBridgesRoute,
  settingsExchangesRoute,
  // settingsRoute.addChildren([
  //   // settingsLanguagesRoute,
  //   // settingsBridgesRoute,
  //   // settingsExchangesRoute,
  // ]),
  settingsRoute,
  fromTokenRoute,
  fromTokenFromChainRoute,
  toTokenRoute,
  toTokenToChainRoute,
  toTokenNativeRoute,
  routesRoute,
  transactionExecutionRoute,
  activeTransactionsRoute,
  sendToWalletRoute,
  sendToWalletBookmarksRoute,
  sendToWalletRecentWalletsRoute,
  sendToWalletConnectedWalletsRoute,
  // sendToWalletRoute.addChildren([
  //   sendToWalletBookmarksRoute,
  //   sendToWalletRecentWalletsRoute,
  //   sendToWalletConnectedWalletsRoute,
  // ]),
  configuredWalletsRoute,
  transactionHistoryRoute,
  transactionHistoryDetailsRoute,
])

declare module '@tanstack/react-router' {
  interface Register {
    router: Router<typeof routeTree>
  }
}

export const AppDefault = () => {
  const router = useMemo(() => {
    const history = createMemoryHistory({
      initialEntries: ['/'],
    })

    return createRouter({
      routeTree,
      history,
      defaultPreload: 'intent',
    })
  }, [])

  return <RouterProvider router={router} />
}
