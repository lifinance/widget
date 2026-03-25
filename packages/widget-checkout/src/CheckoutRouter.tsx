import {
  navigationRoutes,
  RoutesPage,
  SelectChainPage,
  TransactionDetailsPage,
  TransactionPage,
} from '@lifi/widget'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { CheckoutLayout } from './CheckoutLayout.js'
import { EnterAmountPage } from './pages/EnterAmountPage/EnterAmountPage.js'
import { ProgressPage } from './pages/ProgressPage/ProgressPage.js'
import { SelectDepositTokenPage } from './pages/SelectDepositTokenPage/SelectDepositTokenPage.js'
import { SelectSourcePage } from './pages/SelectSourcePage/SelectSourcePage.js'
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
  enterAmountRoute,
  progressRoute,
  fromTokenLayoutRoute.addChildren([
    fromTokenIndexRoute,
    fromTokenFromChainRoute,
  ]),
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
