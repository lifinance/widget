import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { SelectChainPage } from '../pages/SelectChainPage/SelectChainPage.js'
import { navigationRoutes } from '../utils/navigationRoutes.js'
import { CheckoutLayout } from './CheckoutLayout.js'
import { CheckoutRoutesPage } from './pages/CheckoutRoutesPage.js'
import { CheckoutTransactionDetailsPage } from './pages/CheckoutTransactionDetailsPage/CheckoutTransactionDetailsPage.js'
import { CheckoutTransactionPage } from './pages/CheckoutTransactionPage.js'
import { CheckoutTransactionStatusPage } from './pages/CheckoutTransactionStatusPage/CheckoutTransactionStatusPage.js'
import { DepositErrorRoutePage } from './pages/DepositErrorPages/DepositErrorRoutePage.js'
import { EnterAmountPage } from './pages/EnterAmountPage/EnterAmountPage.js'
import { ProgressPage } from './pages/ProgressPage/ProgressPage.js'
import { SelectCashCurrencyPage } from './pages/SelectCashCurrencyPage/SelectCashCurrencyPage.js'
import { SelectDepositTokenPage } from './pages/SelectDepositTokenPage/SelectDepositTokenPage.js'
import { SelectSourcePage } from './pages/SelectSourcePage/SelectSourcePage.js'
import { TransferDepositPage } from './pages/TransferDepositPage/TransferDepositPage.js'
import { checkoutNavigationRoutes } from './utils/navigationRoutes.js'

const rootRoute = createRootRoute({
  component: CheckoutLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.home,
  component: SelectSourcePage,
})

const enterAmountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.enterAmount,
  component: EnterAmountPage,
})

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.progress,
  component: ProgressPage,
})

const transferDepositRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.transferDeposit,
  component: TransferDepositPage,
})

const depositErrorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.depositError,
  component: DepositErrorRoutePage,
})

const selectCashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.selectCash,
  component: SelectCashCurrencyPage,
})

const fromTokenLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.fromToken,
})

const fromTokenIndexRoute = createRoute({
  getParentRoute: () => fromTokenLayoutRoute,
  path: '/',
  component: SelectDepositTokenPage,
})

const fromTokenFromChainRoute = createRoute({
  getParentRoute: () => fromTokenLayoutRoute,
  path: navigationRoutes.fromChain,
  component: () => <SelectChainPage formType="from" />,
})

const routesLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.routes,
})

const routesIndexRoute = createRoute({
  getParentRoute: () => routesLayoutRoute,
  path: '/',
  component: CheckoutRoutesPage,
})

const routesTransactionExecutionRoute = createRoute({
  getParentRoute: () => routesLayoutRoute,
  path: navigationRoutes.transactionExecution,
})

const routesTransactionExecutionIndexRoute = createRoute({
  getParentRoute: () => routesTransactionExecutionRoute,
  path: '/',
  component: CheckoutTransactionPage,
})

const routesTransactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => routesTransactionExecutionRoute,
  path: navigationRoutes.transactionDetails,
  component: CheckoutTransactionDetailsPage,
})

const routesTransactionExecutionStatusRoute = createRoute({
  getParentRoute: () => routesTransactionExecutionRoute,
  path: checkoutNavigationRoutes.transactionStatus,
  component: CheckoutTransactionStatusPage,
})

const transactionExecutionLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: navigationRoutes.transactionExecution,
})

const transactionExecutionIndexRoute = createRoute({
  getParentRoute: () => transactionExecutionLayoutRoute,
  path: '/',
  component: CheckoutTransactionPage,
})

const transactionExecutionDetailsRoute = createRoute({
  getParentRoute: () => transactionExecutionLayoutRoute,
  path: navigationRoutes.transactionDetails,
  component: CheckoutTransactionDetailsPage,
})

const transactionExecutionStatusRoute = createRoute({
  getParentRoute: () => transactionExecutionLayoutRoute,
  path: checkoutNavigationRoutes.transactionStatus,
  component: CheckoutTransactionStatusPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  enterAmountRoute,
  progressRoute,
  transferDepositRoute,
  depositErrorRoute,
  selectCashRoute,
  fromTokenLayoutRoute.addChildren([
    fromTokenIndexRoute,
    fromTokenFromChainRoute,
  ]),
  routesLayoutRoute.addChildren([
    routesIndexRoute,
    routesTransactionExecutionRoute.addChildren([
      routesTransactionExecutionIndexRoute,
      routesTransactionExecutionDetailsRoute,
      routesTransactionExecutionStatusRoute,
    ]),
  ]),
  transactionExecutionLayoutRoute.addChildren([
    transactionExecutionIndexRoute,
    transactionExecutionDetailsRoute,
    transactionExecutionStatusRoute,
  ]),
])

const history = createMemoryHistory({
  initialEntries: ['/'],
})

const router = createRouter({
  routeTree,
  history,
  defaultPreload: 'intent',
})

export const CheckoutRouter: React.FC = () => {
  return <RouterProvider router={router} />
}
