import { navigationRoutes } from '@lifi/widget/shared'

/**
 * Root-absolute paths for `navigate({ to })` inside checkout.
 * Relative segments resolve against the current path (e.g. `/enter-amount`)
 * and break for nested targets like `transaction-execution`.
 */
export const checkoutAbsolutePaths: { transactionExecution: string } = {
  transactionExecution: `/${navigationRoutes.transactionExecution}`,
}

export const checkoutNavigationRoutes = {
  home: '/',
  enterAmount: '/enter-amount',
  progress: '/progress',
  transferDeposit: '/transfer-deposit',
  depositError: '/deposit-error/$kind',
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

export const checkoutNavigationRoutesValues: CheckoutNavigationRoute[] =
  Object.values(checkoutNavigationRoutes)

/**
 * Routes that surface a back button in the header. Status/progress/error
 * pages (`progress`, `transfer-deposit`, `transaction-execution`,
 * `transaction-status`, every `deposit-error/*`) intentionally omit the
 * back button — once a transfer is committed or terminal state is reached,
 * "back" is misleading.
 */
export const backButtonRoutes: string[] = [
  'enter-amount',
  'select-cash',
  checkoutNavigationRoutes.fromToken,
  checkoutNavigationRoutes.fromChain,
  checkoutNavigationRoutes.routes,
  checkoutNavigationRoutes.transactionDetails,
]
