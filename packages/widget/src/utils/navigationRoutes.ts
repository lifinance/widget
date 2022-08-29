export const navigationRoutes = {
  home: '/',
  selectWallet: 'select-wallet',
  settings: 'settings',
  fromToken: 'select-from-token',
  toToken: 'select-to-token',
  swapRoutes: 'swap-routes',
  swapExecution: 'swap-execution',
  swapHistory: 'swap-history',
  activeSwaps: 'active-swaps',
  swapDetails: 'swap-details',
};

export const navigationRoutesValues = Object.values(navigationRoutes);

export const stickyHeaderRoutes = [
  navigationRoutes.selectWallet,
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
  navigationRoutes.swapRoutes,
  navigationRoutes.swapExecution,
  navigationRoutes.swapDetails,
];

export type NavigationRouteType = keyof typeof navigationRoutes;
