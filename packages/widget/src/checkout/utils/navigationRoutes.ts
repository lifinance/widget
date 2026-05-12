import { navigationRoutes } from '../../utils/navigationRoutes.js'

/**
 * Root-absolute paths for `navigate({ to })` inside checkout.
 * Relative segments resolve against the current path (e.g. `/enter-amount`)
 * and break for nested targets like `transaction-execution`.
 */
export const checkoutAbsolutePaths: { transactionExecution: string } = {
  transactionExecution: `/${navigationRoutes.transactionExecution}`,
}

/**
 * Checkout routes + widget-aligned segments so composed @lifi/widget components navigate correctly.
 */
export const checkoutNavigationRoutes = {
  home: '/',
  /** Full paths for typed `navigate({ to })` (TanStack expects leading `/` on root routes). */
  enterAmount: '/enter-amount',
  progress: '/progress',
  transferDeposit: '/transfer-deposit',
  selectCash: '/select-cash',
  fromToken: 'from-token',
  fromChain: 'from-chain',
  routes: 'routes',
  transactionExecution: 'transaction-execution',
  transactionDetails: 'transaction-details',
  transactionStatus: 'transaction-status',
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
  'transfer-deposit',
  'select-cash',
  checkoutNavigationRoutes.fromToken,
  checkoutNavigationRoutes.fromChain,
  checkoutNavigationRoutes.routes,
  checkoutNavigationRoutes.transactionExecution,
  checkoutNavigationRoutes.transactionDetails,
]
