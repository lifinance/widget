import type { Route, Token } from '@lifi/sdk';
import Big from 'big.js';

export const getGasCostsBreakdown = (route: Route) => {
  return Object.values(
    route.steps.reduce(
      (groupedGasCosts, step) => {
        if (step.estimate.gasCosts?.length) {
          const { token } = step.estimate.gasCosts[0];
          const gasCostAmount = step.estimate.gasCosts
            .reduce(
              (amount, gasCost) => amount.plus(Big(gasCost.amount || 0)),
              Big(0),
            )
            .div(10 ** token.decimals);
          const gasCostAmountUSD = step.estimate.gasCosts.reduce(
            (amount, gasCost) => amount + parseFloat(gasCost.amountUSD || '0'),
            0,
          );
          const groupedGasCost = groupedGasCosts[token.chainId];
          const amount = groupedGasCost
            ? groupedGasCost.amount.plus(gasCostAmount)
            : gasCostAmount;
          const amountUSD = groupedGasCost
            ? groupedGasCost.amountUSD + gasCostAmountUSD
            : gasCostAmountUSD;
          groupedGasCosts[token.chainId] = {
            amount,
            amountUSD,
            token,
          };
          return groupedGasCosts;
        }
        return groupedGasCosts;
      },
      {} as Record<
        number,
        {
          amount: Big;
          amountUSD: number;
          token: Token;
        }
      >,
    ),
  );
};

export const getFeeCostsBreakdown = (route: Route, included?: boolean) => {
  return Object.values(
    route.steps.reduce(
      (groupedFeeCosts, step) => {
        let feeCosts = step.estimate.feeCosts;
        if (typeof included === 'boolean') {
          feeCosts = feeCosts?.filter(
            (feeCost) => feeCost.included === included,
          );
        }
        if (feeCosts?.length) {
          const { token } = feeCosts[0];
          const feeCostAmount = feeCosts
            .reduce(
              (amount, feeCost) => amount.plus(Big(feeCost.amount || 0)),
              Big(0),
            )
            .div(10 ** token.decimals);
          const feeCostAmountUSD = feeCosts.reduce(
            (amount, feeCost) => amount + parseFloat(feeCost.amountUSD || '0'),
            0,
          );
          const groupedFeeCost = groupedFeeCosts[token.chainId];
          const amount = groupedFeeCost
            ? groupedFeeCost.amount.plus(feeCostAmount)
            : feeCostAmount;
          const amountUSD = groupedFeeCost
            ? groupedFeeCost.amountUSD + feeCostAmountUSD
            : feeCostAmountUSD;
          groupedFeeCosts[token.chainId] = {
            amount,
            amountUSD,
            token,
          };
          return groupedFeeCosts;
        }
        return groupedFeeCosts;
      },
      {} as Record<
        number,
        {
          amount: Big;
          amountUSD: number;
          token: Token;
        }
      >,
    ),
  );
};
