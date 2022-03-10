export const routes = {
  home: '/',
  settings: '/settings',
  fromToken: '/select-from-token',
  toToken: '/select-to-token',
  selectWallet: '/select-wallet',
};

export type RouteType = keyof typeof routes;
