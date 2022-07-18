export const navigationRoutes = {
  home: '/',
  selectWallet: 'select-wallet',
  settings: 'settings',
  fromToken: 'select-from-token',
  toToken: 'select-to-token',
  swapRoutes: 'swap-routes',
  swap: 'swap',
};

export const navigationRoutesValues = Object.values(navigationRoutes);

export type NavigationRouteType = keyof typeof navigationRoutes;
