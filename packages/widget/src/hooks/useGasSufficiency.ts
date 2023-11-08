import type { EVMChain, RouteExtended, Token } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { getTokenBalancesWithRetry, useAvailableChains, useGasRefuel } from '.';
import { useSettings } from '../stores';
import { useAccount } from './useAccount';

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
  const { account } = useAccount();
  const { getChainById } = useAvailableChains();

  const { enabledAutoRefuel } = useSettings(['enabledAutoRefuel']);
  const { enabled, isLoading: isRefuelLoading } = useGasRefuel();
  const enabledRefuel = enabled && enabledAutoRefuel;

  const { data: insufficientGas, isLoading } = useQuery({
    queryKey: ['gas-sufficiency-check', account.address, route?.id],
    queryFn: async () => {
      if (!account.address || !route) {
        return;
      }

      // TODO: include LI.Fuel into calculation once steps and tools are properly typed
      // const refuelSteps = route.steps
      //   .flatMap((step) => step.includedSteps)
      //   .filter((includedStep) => includedStep.tool === 'lifuelProtocol');

      const gasCosts = route.steps
        .filter((step) => !step.execution || step.execution.status !== 'DONE')
        .reduce(
          (groupedGasCosts, step) => {
            if (step.estimate.gasCosts && account.connector?.id !== 'safe') {
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

      if (
        route.fromToken.address === gasCosts[route.fromChainId]?.token.address
      ) {
        gasCosts[route.fromChainId].tokenAmount =
          gasCosts[route.fromChainId]?.gasAmount + BigInt(route.fromAmount);
      }

      const tokenBalances = await getTokenBalancesWithRetry(
        account.address,
        Object.values(gasCosts).map((item) => item.token),
      );

      if (!tokenBalances?.length) {
        return;
      }

      [route.fromChainId, route.toChainId].forEach((chainId) => {
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

  const isInsufficientGas =
    Boolean(insufficientGas?.length) && !isRefuelLoading && !enabledRefuel;

  return {
    insufficientGas: isInsufficientGas ? insufficientGas : undefined,
    isLoading,
  };
};
