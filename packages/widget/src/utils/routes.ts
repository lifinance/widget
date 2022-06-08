export const routes = {
  home: '/',
  selectWallet: 'select-wallet',
  settings: 'settings',
  fromToken: 'select-from-token',
  toToken: 'select-to-token',
  swapRoutes: 'swap-routes',
  swap: 'swap',
};

export const routesValues = Object.values(routes);

export type RouteType = keyof typeof routes;
