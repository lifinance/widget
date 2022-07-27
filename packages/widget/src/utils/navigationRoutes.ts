export const navigationRoutes = {
  home: '/',
  selectWallet: 'select-wallet',
  settings: 'settings',
  fromToken: 'select-from-token',
  toToken: 'select-to-token',
  swapRoutes: 'swap-routes',
  swapExecution: 'swap-execution',
  swapHistory: 'swap-history',
  swapDetails: 'swap-details',
};

export const navigationRoutesValues = Object.values(navigationRoutes);

export type NavigationRouteType = keyof typeof navigationRoutes;
