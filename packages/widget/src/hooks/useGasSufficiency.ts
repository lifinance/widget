import { type EVMChain, type RouteExtended, type Token } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import type { Connector } from 'wagmi';
import { useAccount } from './useAccount.js';
import { useAvailableChains } from './useAvailableChains.js';
import { getTokenBalancesWithRetry } from './useTokenBalance.js';

export interface GasSufficiency {
  gasAmount: bigint;
  tokenAmount?: bigint;
  insufficientAmount?: bigint;
  insufficient?: boolean;
  token: Token;
  chain?: EVMChain;
}

const refetchInterval = 30_000;

export const useGasSufficiency = (route?: RouteExtended) => {
  const { getChainById } = useAvailableChains();
  const { account } = useAccount({
    chainType: getChainById(route?.fromChainId)?.chainType,
  });

  const { data: insufficientGas, isLoading } = useQuery({
    queryKey: ['gas-sufficiency-check', account.address, route?.id],
    queryFn: async ({ queryKey: [, accountAddress] }) => {
      // We assume that LI.Fuel protocol always refuels the destination chain
      const hasRefuelStep = route!.steps
        .flatMap((step) => step.includedSteps)
        .some((includedStep) => includedStep.tool === 'lifuelProtocol');

      const gasCosts = route!.steps
        .filter((step) => !step.execution || step.execution.status !== 'DONE')
        .reduce(
          (groupedGasCosts, step) => {
            // We need to avoid destination chain step sufficiency check if we have LI.Fuel protocol sub-step
            const skipDueToRefuel =
              step.action.fromChainId === route?.toChainId && hasRefuelStep;
            if (
              step.estimate.gasCosts &&
              (account.connector as Connector)?.id !== 'safe' &&
              !skipDueToRefuel
            ) {
              const { token } = step.estimate.gasCosts[0];
              const gasCostAmount = step.estimate.gasCosts.reduce(
                (amount, gasCost) => amount + BigInt(gasCost.amount),
                0n,
              );
              groupedGasCosts[token.chainId] = {
                gasAmount: groupedGasCosts[token.chainId]
                  ? groupedGasCosts[token.chainId].gasAmount + gasCostAmount
                  : gasCostAmount,
                token,
              };
            }
            // Add fees paid in native tokens to gas sufficiency check (included: false)
            const nonIncludedFeeCosts = step.estimate.feeCosts?.filter(
              (feeCost) => !feeCost.included,
            );
            if (nonIncludedFeeCosts?.length) {
              const { token } = nonIncludedFeeCosts[0];
              const feeCostAmount = nonIncludedFeeCosts.reduce(
                (amount, feeCost) => amount + BigInt(feeCost.amount),
                0n,
              );
              groupedGasCosts[token.chainId] = {
                gasAmount: groupedGasCosts[token.chainId]
                  ? groupedGasCosts[token.chainId].gasAmount + feeCostAmount
                  : feeCostAmount,
                token,
              } as any;
            }
            return groupedGasCosts;
          },
          {} as Record<number, GasSufficiency>,
        );

      // Check whether we are sending a native token
      // For native tokens we want to check for the total amount, including the network fee
      if (
        route!.fromToken.address === gasCosts[route!.fromChainId]?.token.address
      ) {
        gasCosts[route!.fromChainId].tokenAmount =
          gasCosts[route!.fromChainId]?.gasAmount + BigInt(route!.fromAmount);
      }

      const tokenBalances = await getTokenBalancesWithRetry(
        accountAddress!,
        Object.values(gasCosts).map((item) => item.token),
      );

      if (!tokenBalances?.length) {
        return [];
      }

      [route!.fromChainId, route!.toChainId].forEach((chainId) => {
        if (gasCosts[chainId]) {
          const gasTokenBalance =
            tokenBalances?.find(
              (t) =>
                t.chainId === gasCosts[chainId].token.chainId &&
                t.address === gasCosts[chainId].token.address,
            )?.amount ?? 0n;
          const insufficient =
            gasTokenBalance <= 0n ||
            gasTokenBalance < gasCosts[chainId].gasAmount ||
            gasTokenBalance < (gasCosts[chainId].tokenAmount ?? 0n);

          const insufficientAmount = insufficient
            ? gasCosts[chainId].tokenAmount
              ? gasCosts[chainId].tokenAmount! - gasTokenBalance
              : gasCosts[chainId].gasAmount - gasTokenBalance
            : undefined;

          gasCosts[chainId] = {
            ...gasCosts[chainId],
            insufficient,
            insufficientAmount,
            chain: insufficient ? getChainById(chainId) : undefined,
          };
        }
      });

      const gasCostResult = Object.values(gasCosts).filter(
        (gasCost) => gasCost.insufficient,
      );

      return gasCostResult;
    },

    enabled: Boolean(account.address && route),
    refetchInterval,
    staleTime: refetchInterval,
  });

  return {
    insufficientGas,
    isLoading,
  };
};
