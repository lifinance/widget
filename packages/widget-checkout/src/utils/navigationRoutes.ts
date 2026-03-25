import { navigationRoutes } from '@lifi/widget'

/**
 * Checkout routes + widget-aligned segments so composed @lifi/widget components navigate correctly.
 */
export const checkoutNavigationRoutes = {
  home: navigationRoutes.home,
  /** Full paths for typed `navigate({ to })` (TanStack expects leading `/` on root routes). */
  enterAmount: '/enter-amount',
  progress: '/progress',
  fundingMethods: '/funding-methods',
  fundingProvider: '/funding-provider',
  fromToken: navigationRoutes.fromToken,
  fromChain: navigationRoutes.fromChain,
  routes: navigationRoutes.routes,
  transactionExecution: navigationRoutes.transactionExecution,
  transactionDetails: navigationRoutes.transactionDetails,
} as const

export type CheckoutNavigationRoute =
  (typeof checkoutNavigationRoutes)[keyof typeof checkoutNavigationRoutes]

export const checkoutNavigationRoutesValues = Object.values(
  checkoutNavigationRoutes
)

/** Last path segment (or nested leaf) for showing the checkout header back control. */
export const backButtonRoutes = [
  'enter-amount',
  'progress',
  'funding-methods',
  'funding-provider',
  checkoutNavigationRoutes.fromToken,
  checkoutNavigationRoutes.fromChain,
  checkoutNavigationRoutes.routes,
  checkoutNavigationRoutes.transactionExecution,
  checkoutNavigationRoutes.transactionDetails,
]
