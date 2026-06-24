import { navigationRoutes, SelectChainPage } from '@lifi/widget/shared'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { useState } from 'react'
import { CheckoutLayout } from './CheckoutLayout.js'
import { CheckoutRoutesPage } from './pages/CheckoutRoutesPage.js'
import { CheckoutTransactionDetailsPage } from './pages/CheckoutTransactionDetailsPage/CheckoutTransactionDetailsPage.js'
import { CheckoutTransactionPage } from './pages/CheckoutTransactionPage.js'
import { CheckoutTransactionStatusPage } from './pages/CheckoutTransactionStatusPage/CheckoutTransactionStatusPage.js'
import { DepositErrorRoutePage } from './pages/DepositErrorPages/DepositErrorRoutePage.js'
import { EnterAmountPage } from './pages/EnterAmountPage/EnterAmountPage.js'
import { ProgressPage } from './pages/ProgressPage/ProgressPage.js'
import { SelectCashCurrencyPage } from './pages/SelectCashCurrencyPage/SelectCashCurrencyPage.js'
import { SelectSourcePage } from './pages/SelectSourcePage/SelectSourcePage.js'
import { SelectTokenPage } from './pages/SelectTokenPage/SelectTokenPage.js'
import { SetDestinationAddressPage } from './pages/SetDestinationAddressPage/SetDestinationAddressPage.js'
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

const setDestinationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.setDestination,
  component: SetDestinationAddressPage,
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
  component: SelectTokenPage,
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
  setDestinationRoute,
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

export const CheckoutRouter: React.FC = () => {
  // Always start at home; the funding screen auto-resumes a single in-flight
  // deposit and surfaces the rest as a tappable activity list.
  const [router] = useState(() =>
    createRouter({
      routeTree,
      history: createMemoryHistory({
        initialEntries: [checkoutNavigationRoutes.home],
      }),
      defaultPreload: 'intent',
    })
  )
  return <RouterProvider router={router} />
}
