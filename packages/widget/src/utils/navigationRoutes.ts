export const navigationRoutes = {
  home: '/',
  activeSwaps: 'active-swaps',
  fromChain: 'from-chain',
  fromToken: 'from-token',
  selectWallet: 'wallet',
  settings: 'settings',
  swapDetails: 'swap-details',
  swapExecution: 'swap-execution',
  swapHistory: 'swap-history',
  swapRoutes: 'swap-routes',
  toChain: 'to-chain',
  toToken: 'to-token',
  toTokenNative: 'to-token-native',
};

export const navigationRoutesValues = Object.values(navigationRoutes);

export const stickyHeaderRoutes = [
  navigationRoutes.activeSwaps,
  navigationRoutes.fromChain,
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.swapDetails,
  navigationRoutes.swapExecution,
  navigationRoutes.swapHistory,
  navigationRoutes.swapRoutes,
  navigationRoutes.toChain,
  navigationRoutes.toTokenNative,
];

export const backButtonRoutes = [
  navigationRoutes.activeSwaps,
  navigationRoutes.fromChain,
  navigationRoutes.fromToken,
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.swapDetails,
  navigationRoutes.swapExecution,
  navigationRoutes.swapHistory,
  navigationRoutes.swapRoutes,
  navigationRoutes.toChain,
  navigationRoutes.toToken,
  navigationRoutes.toTokenNative,
];

export type NavigationRouteType = keyof typeof navigationRoutes;
