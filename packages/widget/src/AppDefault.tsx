import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  type Router,
  RouterProvider,
} from '@tanstack/react-router'
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

const settingsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.settings,
})

const settingsIndexRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: '/',
  component: SettingsPage,
})

const settingsBridgesRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: navigationRoutes.bridges,
  component: () => <SelectEnabledToolsPage type="Bridges" />,
})

const settingsExchangesRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: navigationRoutes.exchanges,
  component: () => <SelectEnabledToolsPage type="Exchanges" />,
})

const settingsLanguagesRoute = createRoute({
  getParentRoute: () => settingsLayoutRoute,
  path: navigationRoutes.languages,
  component: LanguagesPage,
})

const fromTokenLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.fromToken,
})

const fromTokenIndexRoute = createRoute({
  getParentRoute: () => fromTokenLayoutRoute,
  path: '/',
  component: () => <SelectTokenPage formType="from" />,
})

const fromTokenFromChainRoute = createRoute({
  getParentRoute: () => fromTokenLayoutRoute,
  path: navigationRoutes.fromChain,
  component: () => <SelectChainPage formType="from" />,
})

const toTokenLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toToken,
})

const toTokenIndexRoute = createRoute({
  getParentRoute: () => toTokenLayoutRoute,
  path: '/',
  component: () => <SelectTokenPage formType="to" />,
})

const toTokenToChainRoute = createRoute({
  getParentRoute: () => toTokenLayoutRoute,
  path: navigationRoutes.toChain,
  component: () => <SelectChainPage formType="to" />,
})

const toTokenNativeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toTokenNative,
  component: () => <SelectChainPage formType="to" selectNativeToken />,
})

const routesLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.routes,
})

const routesIndexRoute = createRoute({
  getParentRoute: () => routesLayoutRoute,
  path: '/',
  component: RoutesPage,
})

const routesTransactionExecutionRoute = createRoute({
  getParentRoute: () => routesLayoutRoute,
  path: navigationRoutes.transactionExecution,
})

const routesTransactionExecutionIndexRoute = createRoute({
  getParentRoute: () => routesTransactionExecutionRoute,
  path: '/',
  component: TransactionPage,
})

const routesTransactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => routesTransactionExecutionRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const activeTransactionsLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.activeTransactions,
})

const activeTransactionsIndexRoute = createRoute({
  getParentRoute: () => activeTransactionsLayoutRoute,
  path: '/',
  component: ActiveTransactionsPage,
})

const activeTransactionExecutionRoute = createRoute({
  getParentRoute: () => activeTransactionsLayoutRoute,
  path: navigationRoutes.transactionExecution,
  component: TransactionPage,
})

const sendToWalletLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.sendToWallet,
})

const sendToWalletIndexRoute = createRoute({
  getParentRoute: () => sendToWalletLayoutRoute,
  path: '/',
  component: SendToWalletPage,
})

const sendToWalletBookmarksRoute = createRoute({
  getParentRoute: () => sendToWalletLayoutRoute,
  path: navigationRoutes.bookmarks,
  component: BookmarksPage,
})

const sendToWalletRecentWalletsRoute = createRoute({
  getParentRoute: () => sendToWalletLayoutRoute,
  path: navigationRoutes.recentWallets,
  component: RecentWalletsPage,
})

const sendToWalletConnectedWalletsRoute = createRoute({
  getParentRoute: () => sendToWalletLayoutRoute,
  path: navigationRoutes.connectedWallets,
  component: ConnectedWalletsPage,
})

const configuredWalletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.configuredWallets,
  component: SendToConfiguredWalletPage,
})

const transactionHistoryLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionHistory,
})

const transactionHistoryIndexRoute = createRoute({
  getParentRoute: () => transactionHistoryLayoutRoute,
  path: '/',
  component: TransactionHistoryPage,
})

const transactionHistoryDetailsRoute = createRoute({
  getParentRoute: () => transactionHistoryLayoutRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const transactionExecutionLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionExecution,
})

const transactionExecutionIndexRoute = createRoute({
  getParentRoute: () => transactionExecutionLayoutRoute,
  path: '/',
  component: TransactionPage,
})

const transactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => transactionExecutionLayoutRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  settingsLayoutRoute.addChildren([
    settingsIndexRoute,
    settingsLanguagesRoute,
    settingsBridgesRoute,
    settingsExchangesRoute,
  ]),
  fromTokenLayoutRoute.addChildren([
    fromTokenIndexRoute,
    fromTokenFromChainRoute,
  ]),
  toTokenLayoutRoute.addChildren([toTokenIndexRoute, toTokenToChainRoute]),
  toTokenNativeRoute,
  routesLayoutRoute.addChildren([
    routesIndexRoute,
    routesTransactionExecutionRoute.addChildren([
      routesTransactionExecutionIndexRoute,
      routesTransactionExecutionDetailsRoute,
    ]),
  ]),
  transactionExecutionLayoutRoute.addChildren([
    transactionExecutionIndexRoute,
    transactionExecutionDetailsRoute,
  ]),
  activeTransactionsLayoutRoute.addChildren([
    activeTransactionsIndexRoute,
    activeTransactionExecutionRoute,
  ]),
  sendToWalletLayoutRoute.addChildren([
    sendToWalletIndexRoute,
    sendToWalletBookmarksRoute,
    sendToWalletRecentWalletsRoute,
    sendToWalletConnectedWalletsRoute,
  ]),
  configuredWalletsRoute,
  transactionHistoryLayoutRoute.addChildren([
    transactionHistoryIndexRoute,
    transactionHistoryDetailsRoute,
  ]),
])

declare module '@tanstack/react-router' {
  interface Register {
    router: Router<typeof routeTree>
  }
}

const history = createMemoryHistory({
  initialEntries: ['/'],
})

const router = createRouter({
  routeTree,
  history,
  defaultPreload: 'intent',
})

export const AppDefault = () => {
  return <RouterProvider router={router} />
}
