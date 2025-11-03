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

export const selectChainRoutes = {
  fromChain: 'from-chain',
  toChain: 'to-chain',
}

export const transactionRoutes = {
  transactionExecution: 'transaction-execution',
  transactionDetails: 'transaction-details',
}

export const navigationRoutes = {
  home: '/',
  activeTransactions: '/active-transactions',
  activeTransactionExecution: `/active-transactions/${transactionRoutes.transactionExecution}`,
  bridges: `/settings/${settingsRoutes.bridges}`,
  exchanges: `/settings/${settingsRoutes.exchanges}`,
  fromToken: '/from-token',
  fromTokenFromChain: `/from-token/${selectChainRoutes.fromChain}`,
  languages: `/settings/${settingsRoutes.languages}`,
  routes: '/routes',
  routesTransactionDetails: `/routes/${transactionRoutes.transactionDetails}`,
  routesTransactionExecution: `/routes/${transactionRoutes.transactionExecution}`,
  routesTransactionExecutionDetails: `/routes/${transactionRoutes.transactionExecution}/${transactionRoutes.transactionDetails}`,
  routesActiveTransactionExecution: `/routes/active-transactions/${transactionRoutes.transactionExecution}`,
  settings: '/settings',
  toToken: '/to-token',
  toTokenToChain: `/to-token/${selectChainRoutes.toChain}`,
  toTokenNative: '/to-token-native',
  transactionDetails: `/${transactionRoutes.transactionDetails}`,
  transactionExecution: `/${transactionRoutes.transactionExecution}`,
  transactionExecutionDetails: `/${transactionRoutes.transactionExecution}/${transactionRoutes.transactionDetails}`,
  transactionHistory: '/transaction-history',
  transactionHistoryDetails: `/transaction-history/${transactionRoutes.transactionDetails}`,
  transactionHistoryRoutesDetails: `/transaction-history/routes/${transactionRoutes.transactionDetails}`,
  transactionHistoryRoutesExecutionDetails: `/transaction-history/routes/${transactionRoutes.transactionExecution}/${transactionRoutes.transactionDetails}`,
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
  navigationRoutes.fromTokenFromChain,
  navigationRoutes.home,
  navigationRoutes.routes,
  navigationRoutes.settings,
  navigationRoutes.toTokenToChain,
  navigationRoutes.toTokenNative,
  navigationRoutes.transactionDetails,
  navigationRoutes.routesTransactionDetails,
  navigationRoutes.transactionHistoryDetails,
  navigationRoutes.transactionHistoryRoutesDetails,
  navigationRoutes.transactionHistoryRoutesExecutionDetails,
  navigationRoutes.routesTransactionExecutionDetails,
  navigationRoutes.transactionExecution,
  navigationRoutes.routesTransactionExecution,
  navigationRoutes.activeTransactionExecution,
  navigationRoutes.routesActiveTransactionExecution,
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
  navigationRoutes.fromTokenFromChain,
  navigationRoutes.fromToken,
  navigationRoutes.routes,
  navigationRoutes.settings,
  navigationRoutes.toTokenToChain,
  navigationRoutes.toToken,
  navigationRoutes.toTokenNative,
  navigationRoutes.transactionDetails,
  navigationRoutes.routesTransactionDetails,
  navigationRoutes.transactionHistoryDetails,
  navigationRoutes.transactionHistoryRoutesDetails,
  navigationRoutes.transactionHistoryRoutesExecutionDetails,
  navigationRoutes.routesTransactionExecutionDetails,
  navigationRoutes.transactionExecution,
  navigationRoutes.routesTransactionExecution,
  navigationRoutes.activeTransactionExecution,
  navigationRoutes.routesActiveTransactionExecution,
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
