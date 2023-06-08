export const navigationRoutes = {
  home: '/',
  activeTransactions: 'active-transactions',
  bridges: 'bridges',
  exchanges: 'exchanges',
  fromChain: 'from-chain',
  fromToken: 'from-token',
  routes: 'routes',
  selectWallet: 'wallet',
  settings: 'settings',
  toChain: 'to-chain',
  toToken: 'to-token',
  toTokenNative: 'to-token-native',
  transactionDetails: 'transaction-details',
  transactionExecution: 'transaction-execution',
  transactionHistory: 'transaction-history',
};

export const navigationRoutesValues = Object.values(navigationRoutes);

export const stickyHeaderRoutes = [
  navigationRoutes.activeTransactions,
  navigationRoutes.bridges,
  navigationRoutes.exchanges,
  navigationRoutes.fromChain,
  navigationRoutes.home,
  navigationRoutes.routes,
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.toChain,
  navigationRoutes.toTokenNative,
  navigationRoutes.transactionDetails,
  navigationRoutes.transactionExecution,
  navigationRoutes.transactionHistory,
];

export const backButtonRoutes = [
  navigationRoutes.activeTransactions,
  navigationRoutes.bridges,
  navigationRoutes.exchanges,
  navigationRoutes.fromChain,
  navigationRoutes.fromToken,
  navigationRoutes.routes,
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.toChain,
  navigationRoutes.toToken,
  navigationRoutes.toTokenNative,
  navigationRoutes.transactionDetails,
  navigationRoutes.transactionExecution,
  navigationRoutes.transactionHistory,
];

export type NavigationRouteType = keyof typeof navigationRoutes;
