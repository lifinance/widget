export const routes = {
  home: '/',
  settings: '/settings',
  fromToken: '/select-from-token',
  toToken: '/select-to-token',
};

export type RouteType = keyof typeof routes;
