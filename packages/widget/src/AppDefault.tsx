import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
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

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.settings,
  component: () => <Outlet />,
})

const settingsIndexRoute = createRoute({
  getParentRoute: () => settingsRoute,
  path: '/',
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
  component: () => <Outlet />,
})

const fromTokenIndexRoute = createRoute({
  getParentRoute: () => fromTokenRoute,
  path: '/',
  component: () => <SelectTokenPage formType="from" />,
})

const fromTokenFromChainRoute = createRoute({
  getParentRoute: () => fromTokenRoute,
  path: navigationRoutes.fromChain,
  component: () => <SelectChainPage formType="from" />,
})

const toTokenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.toToken,
  component: () => <Outlet />,
})

const toTokenIndexRoute = createRoute({
  getParentRoute: () => toTokenRoute,
  path: '/',
  component: () => <SelectTokenPage formType="to" />,
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
  component: () => <Outlet />,
})

const routesIndexRoute = createRoute({
  getParentRoute: () => routesRoute,
  path: '/',
  component: RoutesPage,
})

const routesTransactionExecutionRoute = createRoute({
  getParentRoute: () => routesRoute,
  path: navigationRoutes.transactionExecution,
  component: () => <Outlet />,
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

const activeTransactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.activeTransactions,
  component: () => <Outlet />,
})

const activeTransactionsIndexRoute = createRoute({
  getParentRoute: () => activeTransactionsRoute,
  path: '/',
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
  component: () => <Outlet />,
})

const sendToWalletIndexRoute = createRoute({
  getParentRoute: () => sendToWalletRoute,
  path: '/',
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
  component: () => <Outlet />,
})

const transactionHistoryIndexRoute = createRoute({
  getParentRoute: () => transactionHistoryRoute,
  path: '/',
  component: TransactionHistoryPage,
})

const transactionHistoryDetailsRoute = createRoute({
  getParentRoute: () => transactionHistoryRoute,
  path: navigationRoutes.transactionDetails,
  component: TransactionDetailsPage,
})

const transactionExecutionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionExecution,
  component: () => <Outlet />,
})

const transactionExecutionIndexRoute = createRoute({
  getParentRoute: () => transactionExecutionRoute,
  path: '/',
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
    settingsIndexRoute,
    settingsLanguagesRoute,
    settingsBridgesRoute,
    settingsExchangesRoute,
  ]),
  fromTokenRoute.addChildren([fromTokenIndexRoute, fromTokenFromChainRoute]),
  toTokenRoute.addChildren([toTokenIndexRoute, toTokenToChainRoute]),
  toTokenNativeRoute,
  routesRoute.addChildren([
    routesIndexRoute,
    routesTransactionExecutionRoute.addChildren([
      routesTransactionExecutionIndexRoute,
      routesTransactionExecutionDetailsRoute,
    ]),
  ]),
  transactionExecutionRoute.addChildren([
    transactionExecutionIndexRoute,
    transactionExecutionDetailsRoute,
  ]),
  activeTransactionsRoute.addChildren([
    activeTransactionsIndexRoute,
    activeTransactionExecutionRoute,
  ]),
  sendToWalletRoute.addChildren([
    sendToWalletIndexRoute,
    sendToWalletBookmarksRoute,
    sendToWalletRecentWalletsRoute,
    sendToWalletConnectedWalletsRoute,
  ]),
  configuredWalletsRoute,
  transactionHistoryRoute.addChildren([
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
