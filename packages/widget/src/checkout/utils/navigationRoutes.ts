/**
 * Checkout routes + widget-aligned segments so composed @lifi/widget components navigate correctly.
 */
export const checkoutNavigationRoutes = {
  home: '/',
  /** Full paths for typed `navigate({ to })` (TanStack expects leading `/` on root routes). */
  enterAmount: '/enter-amount',
  progress: '/progress',
  fromToken: 'from-token',
  fromChain: 'from-chain',
  routes: 'routes',
  transactionExecution: 'transaction-execution',
  transactionDetails: 'transaction-details',
} as const

export type CheckoutNavigationRoute =
  (typeof checkoutNavigationRoutes)[keyof typeof checkoutNavigationRoutes]

export const checkoutNavigationRoutesValues: string[] = Object.values(
  checkoutNavigationRoutes
)

/** Last path segment (or nested leaf) for showing the checkout header back control. */
export const backButtonRoutes: string[] = [
  'enter-amount',
  'progress',
  checkoutNavigationRoutes.fromToken,
  checkoutNavigationRoutes.fromChain,
  checkoutNavigationRoutes.routes,
  checkoutNavigationRoutes.transactionExecution,
  checkoutNavigationRoutes.transactionDetails,
]
