export const settingsRoutes = {
  bridges: 'bridges',
  exchanges: 'exchanges',
  languages: 'languages',
}

export const sendToWalletRoutes = {
  bookmarks: 'bookmarks',
  recentWallets: 'recent-wallets',
  connectedWallets: 'connected-wallets',
}

export const navigationRoutes = {
  home: '/',
  activeTransactions: '/active-transactions',
  bridges: `/settings/${settingsRoutes.bridges}`,
  exchanges: `/settings/${settingsRoutes.exchanges}`,
  fromChain: '/from-chain',
  fromToken: '/from-token',
  languages: `/settings/${settingsRoutes.languages}`,
  routes: '/routes',
  settings: '/settings',
  toChain: '/to-chain',
  toToken: '/to-token',
  toTokenNative: '/to-token-native',
  transactionDetails: '/transaction-details',
  transactionExecution: '/transaction-execution',
  transactionHistory: '/transaction-history',
  sendToWallet: '/send-to-wallet',
  bookmarks: `/send-to-wallet/${sendToWalletRoutes.bookmarks}`,
  recentWallets: `/send-to-wallet/${sendToWalletRoutes.recentWallets}`,
  connectedWallets: `/send-to-wallet/${sendToWalletRoutes.connectedWallets}`,
  configuredWallets: '/configured-wallets',
}

export const navigationRoutesValues = Object.values(navigationRoutes)

export const stickyHeaderRoutes = [
  navigationRoutes.activeTransactions,
  navigationRoutes.bridges,
  navigationRoutes.exchanges,
  navigationRoutes.fromChain,
  navigationRoutes.home,
  navigationRoutes.routes,
  navigationRoutes.settings,
  navigationRoutes.toChain,
  navigationRoutes.toTokenNative,
  navigationRoutes.transactionDetails,
  navigationRoutes.transactionExecution,
  navigationRoutes.transactionHistory,
  navigationRoutes.sendToWallet,
  navigationRoutes.bookmarks,
  navigationRoutes.recentWallets,
  navigationRoutes.connectedWallets,
  navigationRoutes.configuredWallets,
]

export const backButtonRoutes = [
  navigationRoutes.activeTransactions,
  navigationRoutes.bridges,
  navigationRoutes.exchanges,
  navigationRoutes.languages,
  navigationRoutes.fromChain,
  navigationRoutes.fromToken,
  navigationRoutes.routes,
  navigationRoutes.settings,
  navigationRoutes.toChain,
  navigationRoutes.toToken,
  navigationRoutes.toTokenNative,
  navigationRoutes.transactionDetails,
  navigationRoutes.transactionExecution,
  navigationRoutes.transactionHistory,
  navigationRoutes.sendToWallet,
  navigationRoutes.bookmarks,
  navigationRoutes.recentWallets,
  navigationRoutes.connectedWallets,
  navigationRoutes.configuredWallets,
]

type NavigationRouteTypeKeys = keyof typeof navigationRoutes

export type NavigationRouteType =
  (typeof navigationRoutes)[NavigationRouteTypeKeys]
