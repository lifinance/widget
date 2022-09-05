export const navigationRoutes = {
  home: '/',
  selectWallet: 'wallet',
  settings: 'settings',
  fromToken: 'from-token',
  toToken: 'to-token',
  fromChain: 'from-chain',
  toChain: 'to-chain',
  swapRoutes: 'swap-routes',
  swapExecution: 'swap-execution',
  swapHistory: 'swap-history',
  activeSwaps: 'active-swaps',
  swapDetails: 'swap-details',
};

export const navigationRoutesValues = Object.values(navigationRoutes);

export const stickyHeaderRoutes = [
  navigationRoutes.selectWallet,
  navigationRoutes.fromChain,
  navigationRoutes.toChain,
  navigationRoutes.settings,
  navigationRoutes.swapRoutes,
  navigationRoutes.swapExecution,
  navigationRoutes.swapHistory,
  navigationRoutes.activeSwaps,
  navigationRoutes.swapDetails,
];

export const backButtonRoutes = [
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.swapHistory,
  navigationRoutes.activeSwaps,
  navigationRoutes.fromToken,
  navigationRoutes.toToken,
  navigationRoutes.fromChain,
  navigationRoutes.toChain,
  navigationRoutes.swapRoutes,
  navigationRoutes.swapExecution,
  navigationRoutes.swapDetails,
];

export type NavigationRouteType = keyof typeof navigationRoutes;
