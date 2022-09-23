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
  navigationRoutes.activeSwaps,
  navigationRoutes.fromChain,
  navigationRoutes.selectWallet,
  navigationRoutes.settings,
  navigationRoutes.swapDetails,
  navigationRoutes.swapExecution,
  navigationRoutes.swapHistory,
  navigationRoutes.swapRoutes,
  navigationRoutes.toChain,
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
];

export type NavigationRouteType = keyof typeof navigationRoutes;
