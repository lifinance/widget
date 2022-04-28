export const routes = {
  home: '/',
  selectWallet: '/select-wallet',
  settings: '/settings',
  fromToken: '/select-from-token',
  toToken: '/select-to-token',
  swapRoutes: '/swap-routes',
  swapping: '/swapping',
};

export type RouteType = keyof typeof routes;
