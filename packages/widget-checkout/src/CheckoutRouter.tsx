import { useAccount } from '@lifi/wallet-management'
import { navigationRoutes, SelectChainPage } from '@lifi/widget/shared'
import { useCheckoutConfig } from '@lifi/widget-provider/checkout'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { useContext, useState } from 'react'
import { CheckoutLayout } from './CheckoutLayout.js'
import { useSeedFrozenQuote } from './hooks/useFrozenQuote.js'
import { CheckoutRoutesPage } from './pages/CheckoutRoutesPage.js'
import { EnterAmountPage } from './pages/EnterAmountPage/EnterAmountPage.js'
import { SelectCashCurrencyPage } from './pages/SelectCashCurrencyPage/SelectCashCurrencyPage.js'
import { SelectSourcePage } from './pages/SelectSourcePage/SelectSourcePage.js'
import { SelectTokenPage } from './pages/SelectTokenPage/SelectTokenPage.js'
import { CheckoutFlowStoreContext } from './stores/useCheckoutFlowStore.js'
import {
  readPendingRecord,
  resolveResumeKeySync,
} from './stores/usePendingCheckoutStore.js'
import { buildResumeUrl } from './utils/buildResumeUrl.js'
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  enterAmountRoute,
  selectCashRoute,
  fromTokenLayoutRoute.addChildren([
    fromTokenIndexRoute,
    fromTokenFromChainRoute,
  ]),
  routesLayoutRoute.addChildren([routesIndexRoute]),
])

export const CheckoutRouter: React.FC = () => {
  const { integrator, resumePending } = useCheckoutConfig()
  const { accounts } = useAccount()
  const walletAddress = accounts.find(
    (a) => a.isConnected && a.address
  )?.address
  const flowStore = useContext(CheckoutFlowStoreContext)
  const seedFrozenQuote = useSeedFrozenQuote()
  const resumeEnabled = resumePending !== false

  const [router] = useState(() => {
    const record = resumeEnabled
      ? (() => {
          const key = resolveResumeKeySync(integrator, walletAddress)
          return key ? readPendingRecord(key) : null
        })()
      : null
    if (record && flowStore) {
      flowStore.setState({
        fundingSource: record.fundingSource,
        frozenRouteId: record.frozenRouteId ?? null,
      })
    }
    const frozenQuoteFresh =
      !!record?.frozenQuote && record.frozenQuote.expiresAt > Date.now()
    if (frozenQuoteFresh && record?.frozenQuote) {
      seedFrozenQuote({
        id: record.frozenQuote.id,
        route: record.frozenQuote.route,
        expiresAt: record.frozenQuote.expiresAt,
      })
    }
    const initialEntry = record
      ? buildResumeUrl(record, { frozenQuoteFresh })
      : checkoutNavigationRoutes.home
    return createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: [initialEntry] }),
      defaultPreload: 'intent',
    })
  })
  return <RouterProvider router={router} />
}
