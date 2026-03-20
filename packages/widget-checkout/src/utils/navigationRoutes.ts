export const checkoutNavigationRoutes = {
  home: '/',
  depositEntry: '/deposit',
  fundingMethods: '/funding-methods',
  fundingProvider: '/funding-provider',
  status: '/status',
} as const

export type CheckoutNavigationRoute =
  (typeof checkoutNavigationRoutes)[keyof typeof checkoutNavigationRoutes]

export const checkoutNavigationRoutesValues = Object.values(
  checkoutNavigationRoutes
)

export const backButtonRoutes = [
  'deposit',
  'funding-methods',
  'funding-provider',
  'status',
]
