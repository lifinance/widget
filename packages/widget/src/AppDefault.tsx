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

const settingsBridgesRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: navigationRoutes.bridges,
  component: () => <SelectEnabledToolsPage type="Bridges" />,
})

const settingsExchangesRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: navigationRoutes.exchanges,
  component: () => <SelectEnabledToolsPage type="Exchanges" />,
})

const settingsLanguagesRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: navigationRoutes.languages,
  component: LanguagesPage,
})

const fromTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.fromToken,
  component: SelectTokenPage,
})

const fromTokenFromChainRoute = createRoute({
  getParentRoute: () => fromTokenRoute,
  path: navigationRoutes.fromChain,
  component: () => <SelectChainPage formType="from" />,
})

const toTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toToken,
  component: SelectTokenPage,
})

const toTokenToChainRoute = createRoute({
  getParentRoute: () => toTokenRoute,
  path: navigationRoutes.toChain,
  component: () => <SelectChainPage formType="to" />,
})

const toTokenNativeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toTokenNative,
  component: () => <SelectChainPage formType="to" selectNativeToken />,
})

const routesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.routes,
  component: RoutesPage,
})

const routesActiveTransactionsRoute = createRoute({
  getParentRoute: () => routesRoute,
  path: navigationRoutes.activeTransactions,
})

const routesActiveTransactionExecutionRoute = createRoute({
  getParentRoute: () => routesActiveTransactionsRoute,
  path: navigationRoutes.transactionExecution,
  component: TransactionPage,
})

const routesTransactionExecutionRoute = createRoute({
  getParentRoute: () => routesRoute,
  path: navigationRoutes.transactionExecution,
  component: TransactionPage,
})

const routesTransactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => routesTransactionExecutionRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const activeTransactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.activeTransactions,
  component: ActiveTransactionsPage,
})

const activeTransactionExecutionRoute = createRoute({
  getParentRoute: () => activeTransactionsRoute,
  path: navigationRoutes.transactionExecution,
  component: TransactionPage,
})

const sendToWalletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.sendToWallet,
  component: SendToWalletPage,
})

const sendToWalletBookmarksRoute = createRoute({
  getParentRoute: () => sendToWalletRoute,
  path: navigationRoutes.bookmarks,
  component: BookmarksPage,
})

const sendToWalletRecentWalletsRoute = createRoute({
  getParentRoute: () => sendToWalletRoute,
  path: navigationRoutes.recentWallets,
  component: RecentWalletsPage,
})

const sendToWalletConnectedWalletsRoute = createRoute({
  getParentRoute: () => sendToWalletRoute,
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
  getParentRoute: () => transactionHistoryRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const transactionHistoryRoutesRoute = createRoute({
  getParentRoute: () => transactionHistoryRoute,
  path: navigationRoutes.routes,
})

const transactionHistoryRoutesDetailsRoute = createRoute({
  getParentRoute: () => transactionHistoryRoutesRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const transactionHistoryRoutesExecutionRoute = createRoute({
  getParentRoute: () => transactionHistoryRoutesRoute,
  path: navigationRoutes.transactionExecution,
})

const transactionHistoryRoutesExecutionDetailsRoute = createRoute({
  getParentRoute: () => transactionHistoryRoutesExecutionRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const transactionExecutionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionExecution,
  component: TransactionPage,
})

const transactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => transactionExecutionRoute,
  path: navigationRoutes.transactionDetails,
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
    routesActiveTransactionsRoute.addChildren([
      routesActiveTransactionExecutionRoute,
    ]),
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
    transactionHistoryRoutesRoute.addChildren([
      transactionHistoryRoutesDetailsRoute,
      transactionHistoryRoutesExecutionRoute.addChildren([
        transactionHistoryRoutesExecutionDetailsRoute,
      ]),
    ]),
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
