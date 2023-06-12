import type { Route } from '@lifi/sdk';

export const calcValueLoss = (route: Route) => {
  return `${(
    (Number(route.toAmountUSD || 0) /
      (Number(route.fromAmountUSD || 0) + Number(route.gasCostUSD || 0)) -
      1) *
    100
  ).toFixed(2)}%`;
};
