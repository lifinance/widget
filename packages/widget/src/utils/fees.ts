import type { FeeCost, GasCost, RouteExtended, Token } from '@lifi/sdk';
import { formatUnits } from 'viem';

export interface FeesBreakdown {
  amount: bigint;
  amountUSD: number;
  token: Token;
}

export const getAccumulatedFeeCostsBreakdown = (
  route: RouteExtended,
  included: boolean = false,
) => {
  const gasCosts = getGasCostsBreakdown(route);
  const feeCosts = getFeeCostsBreakdown(route, included);
  const gasCostUSD = gasCosts.reduce(
    (sum, gasCost) => sum + gasCost.amountUSD,
    0,
  );
  const feeCostUSD = feeCosts.reduce(
    (sum, feeCost) => sum + feeCost.amountUSD,
    0,
  );
  const combinedFeesUSD = gasCostUSD + feeCostUSD;
  return {
    gasCosts,
    feeCosts,
    gasCostUSD,
    feeCostUSD,
    combinedFeesUSD,
  };
};

export const getGasCostsBreakdown = (route: RouteExtended): FeesBreakdown[] => {
  return Array.from(
    route.steps
      .reduce((groupedGasCosts, step) => {
        const gasCosts = step.execution?.gasCosts ?? step.estimate.gasCosts;
        if (gasCosts?.length) {
          const {
            token,
            amount: gasCostAmount,
            amountUSD: gasCostAmountUSD,
          } = getStepFeeCostsBreakdown(gasCosts);
          const groupedGasCost = groupedGasCosts.get(token.chainId);
          const amount = groupedGasCost
            ? groupedGasCost.amount + gasCostAmount
            : gasCostAmount;
          const amountUSD = groupedGasCost
            ? groupedGasCost.amountUSD + gasCostAmountUSD
            : gasCostAmountUSD;
          groupedGasCosts.set(token.chainId, {
            amount,
            amountUSD,
            token,
          });
          return groupedGasCosts;
        }
        return groupedGasCosts;
      }, new Map<number, FeesBreakdown>())
      .values(),
  );
};

export const getFeeCostsBreakdown = (
  route: RouteExtended,
  included?: boolean,
): FeesBreakdown[] => {
  return Array.from(
    route.steps
      .reduce((groupedFeeCosts, step) => {
        let feeCosts = step.execution?.feeCosts ?? step.estimate.feeCosts;
        if (typeof included === 'boolean') {
          feeCosts = feeCosts?.filter(
            (feeCost) => feeCost.included === included,
          );
        }
        if (feeCosts?.length) {
          const {
            token,
            amount: feeCostAmount,
            amountUSD: feeCostAmountUSD,
          } = getStepFeeCostsBreakdown(feeCosts);
          const groupedFeeCost = groupedFeeCosts.get(token.chainId);
          const amount = groupedFeeCost
            ? groupedFeeCost.amount + feeCostAmount
            : feeCostAmount;
          const amountUSD = groupedFeeCost
            ? groupedFeeCost.amountUSD + feeCostAmountUSD
            : feeCostAmountUSD;
          groupedFeeCosts.set(token.chainId, {
            amount,
            amountUSD,
            token,
          });
          return groupedFeeCosts;
        }
        return groupedFeeCosts;
      }, new Map<number, FeesBreakdown>())
      .values(),
  );
};

export const getStepFeeCostsBreakdown = (
  feeCosts: FeeCost[] | GasCost[],
): FeesBreakdown => {
  const token = feeCosts[0].token;
  const amount = feeCosts.reduce(
    (amount, feeCost) => amount + BigInt(feeCost.amount || 0),
    0n,
  );
  const amountUSD = feeCosts.reduce(
    (amount, feeCost) =>
      amount +
      parseFloat(feeCost.token.priceUSD || '0') *
        parseFloat(
          formatUnits(BigInt(feeCost.amount || 0), feeCost.token.decimals),
        ),
    0,
  );
  return {
    amount,
    amountUSD,
    token,
  };
};
