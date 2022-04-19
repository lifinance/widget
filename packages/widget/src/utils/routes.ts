export const routes = {
  home: '/',
  selectWallet: '/select-wallet',
  settings: '/settings',
  fromToken: '/select-from-token',
  toToken: '/select-to-token',
  swapRoutes: '/swap-routes',
  transaction: '/transaction',
};

export type RouteType = keyof typeof routes;
