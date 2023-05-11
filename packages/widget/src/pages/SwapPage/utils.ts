import type { Route } from '@lifi/sdk';
import { Big } from 'big.js';

export const calcValueLoss = (route: Route) => {
  return `${Big(route.toAmountUSD || 0)
    .div(Big(route.fromAmountUSD || 0).plus(Big(route.gasCostUSD || 0)))
    .minus(1)
    .mul(100)
    .round(2, Big.roundUp)
    .toString()}
  %`;
};
