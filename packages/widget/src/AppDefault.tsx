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
import {
  navigationRoutes,
  selectChainRoutes,
  sendToWalletRoutes,
  settingsRoutes,
  transactionRoutes,
} from './utils/navigationRoutes.js'

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

const settingsBridgesRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: settingsRoutes.bridges,
  component: SelectEnabledToolsPage,
})

const settingsExchangesRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: settingsRoutes.exchanges,
  component: SelectEnabledToolsPage,
})

const settingsLanguagesRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: settingsRoutes.languages,
  component: LanguagesPage,
})

const fromTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.fromToken,
  component: SelectTokenPage,
})

const fromTokenFromChainRoute = createRoute({
  getParentRoute: () => fromTokenRoute,
  path: selectChainRoutes.fromChain,
  component: SelectChainPage,
})

const toTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toToken,
  component: SelectTokenPage,
})

const toTokenToChainRoute = createRoute({
  getParentRoute: () => toTokenRoute,
  path: selectChainRoutes.toChain,
  component: SelectChainPage,
})

const toTokenNativeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toTokenNative,
  component: SelectChainPage,
})

const routesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.routes,
  component: RoutesPage,
})

const routesActiveTransactionExecutionRoute = createRoute({
  getParentRoute: () => routesRoute,
  path: `active-transactions/${transactionRoutes.transactionExecution}`,
  component: TransactionPage,
})

const routesTransactionExecutionRoute = createRoute({
  getParentRoute: () => routesRoute,
  path: transactionRoutes.transactionExecution,
  component: TransactionPage,
})

const routesTransactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => routesTransactionExecutionRoute,
  path: transactionRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const activeTransactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.activeTransactions,
  component: ActiveTransactionsPage,
})

const activeTransactionExecutionRoute = createRoute({
  getParentRoute: () => activeTransactionsRoute,
  path: transactionRoutes.transactionExecution,
  component: TransactionPage,
})

const sendToWalletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.sendToWallet,
  component: SendToWalletPage,
})

const sendToWalletBookmarksRoute = createRoute({
  getParentRoute: () => sendToWalletRoute,
  path: sendToWalletRoutes.bookmarks,
  component: BookmarksPage,
})

const sendToWalletRecentWalletsRoute = createRoute({
  getParentRoute: () => sendToWalletRoute,
  path: sendToWalletRoutes.recentWallets,
  component: RecentWalletsPage,
})

const sendToWalletConnectedWalletsRoute = createRoute({
  getParentRoute: () => sendToWalletRoute,
  path: sendToWalletRoutes.connectedWallets,
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
  getParentRoute: () => transactionHistoryRoute,
  path: transactionRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const transactionHistoryRoutesDetailsRoute = createRoute({
  getParentRoute: () => transactionHistoryRoute,
  path: `routes/${transactionRoutes.transactionDetails}`,
  component: TransactionDetailsPage,
})

const transactionHistoryRoutesExecutionDetails = createRoute({
  getParentRoute: () => transactionHistoryRoute,
  path: `routes/${transactionRoutes.transactionExecution}/${transactionRoutes.transactionDetails}`,
  component: TransactionDetailsPage,
})

const transactionExecutionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionExecution,
  component: TransactionPage,
})

const transactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => transactionExecutionRoute,
  path: transactionRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsRoute.addChildren([
    settingsLanguagesRoute,
    settingsBridgesRoute,
    settingsExchangesRoute,
  ]),
  fromTokenRoute.addChildren([fromTokenFromChainRoute]),
  toTokenRoute.addChildren([toTokenToChainRoute]),
  toTokenNativeRoute,
  routesRoute.addChildren([
    routesActiveTransactionExecutionRoute,
    routesTransactionExecutionRoute.addChildren([
      routesTransactionExecutionDetailsRoute,
    ]),
  ]),
  transactionExecutionRoute.addChildren([transactionExecutionDetailsRoute]),
  activeTransactionsRoute.addChildren([activeTransactionExecutionRoute]),
  sendToWalletRoute.addChildren([
    sendToWalletBookmarksRoute,
    sendToWalletRecentWalletsRoute,
    sendToWalletConnectedWalletsRoute,
  ]),
  configuredWalletsRoute,
  transactionHistoryRoute.addChildren([
    transactionHistoryDetailsRoute,
    transactionHistoryRoutesDetailsRoute,
    transactionHistoryRoutesExecutionDetails,
  ]),
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
