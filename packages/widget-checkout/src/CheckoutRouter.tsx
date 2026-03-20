import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { CheckoutLayout } from './CheckoutLayout.js'
import { DepositEntryPage } from './pages/DepositEntryPage.js'
import { FundingMethodsPage } from './pages/FundingMethodsPage.js'
import { FundingProviderPage } from './pages/FundingProviderPage.js'
import { checkoutNavigationRoutes } from './utils/navigationRoutes.js'

const rootRoute = createRootRoute({
  component: CheckoutLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.home,
  component: DepositEntryPage,
})

const fundingMethodsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.fundingMethods,
  component: FundingMethodsPage,
})

const fundingProviderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: checkoutNavigationRoutes.fundingProvider,
  component: FundingProviderPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  fundingMethodsRoute,
  fundingProviderRoute,
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
