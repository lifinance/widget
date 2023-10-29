import type { EVMChain, Route, Token } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import Big from 'big.js';
import { useChains, useGasRefuel, useGetTokenBalancesWithRetry } from '.';
import { useWallet, useWidgetConfig } from '../providers';
import { useSettings } from '../stores';

export interface GasSufficiency {
  gasAmount: Big;
  tokenAmount?: Big;
  insufficientAmount?: Big;
  insufficient?: boolean;
  token: Token;
  chain?: EVMChain;
}

const refetchInterval = 30_000;

export const useGasSufficiency = (route?: Route) => {
  const { account } = useWallet();
  const { getChainById } = useChains();
  const getTokenBalancesWithRetry = useGetTokenBalancesWithRetry(
    account.signer?.provider,
  );
  const { sdkConfig } = useWidgetConfig();
  const isMultisigSigner = sdkConfig?.multisigConfig?.isMultisigSigner;

  const { enabledAutoRefuel } = useSettings(['enabledAutoRefuel']);
  const { enabled, isLoading: isRefuelLoading } = useGasRefuel();
  const enabledRefuel = enabled && enabledAutoRefuel;

  const { data: insufficientGas, isInitialLoading } = useQuery(
    ['gas-sufficiency-check', account.address, route?.id],
    async () => {
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
            if (step.estimate.gasCosts && !isMultisigSigner) {
              const { token } = step.estimate.gasCosts[0];
              const gasCostAmount = step.estimate.gasCosts
                .reduce(
                  (amount, gasCost) => amount.plus(Big(gasCost.amount || 0)),
                  Big(0),
                )
                .div(10 ** token.decimals);
              groupedGasCosts[token.chainId] = {
                gasAmount:
                  groupedGasCosts[token.chainId]?.gasAmount.plus(
                    gasCostAmount,
                  ) ?? gasCostAmount,
                token,
              };
            }
            // Add fees paid in native tokens to gas sufficiency check (included: false)
            const nonIncludedFeeCosts = step.estimate.feeCosts?.filter(
              (feeCost) => !feeCost.included,
            );
            if (nonIncludedFeeCosts?.length) {
              const { token } = nonIncludedFeeCosts[0];
              const feeCostAmount = nonIncludedFeeCosts
                .reduce(
                  (amount, feeCost) => amount.plus(Big(feeCost.amount || 0)),
                  Big(0),
                )
                .div(10 ** token.decimals);
              groupedGasCosts[token.chainId] = {
                gasAmount:
                  groupedGasCosts[token.chainId]?.gasAmount.plus(
                    feeCostAmount,
                  ) ?? feeCostAmount,
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
        gasCosts[route.fromChainId].tokenAmount = gasCosts[
          route.fromChainId
        ].gasAmount.plus(
          Big(route.fromAmount).div(10 ** route.fromToken.decimals),
        );
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
          const gasTokenBalance = Big(
            tokenBalances?.find(
              (t) =>
                t.chainId === gasCosts[chainId].token.chainId &&
                t.address === gasCosts[chainId].token.address,
            )?.amount ?? 0,
          );

          const insufficient =
            gasTokenBalance.lte(0) ||
            gasTokenBalance.lt(gasCosts[chainId].gasAmount ?? Big(0)) ||
            gasTokenBalance.lt(gasCosts[chainId].tokenAmount ?? Big(0));

          const insufficientAmount = insufficient
            ? gasCosts[chainId].tokenAmount?.minus(gasTokenBalance) ??
              gasCosts[chainId].gasAmount.minus(gasTokenBalance)
            : undefined;

          gasCosts[chainId] = {
            ...gasCosts[chainId],
            insufficient,
            insufficientAmount: insufficientAmount?.round(5, Big.roundUp),
            chain: insufficient ? getChainById(chainId) : undefined,
          };
        }
      });

      const gasCostResult = Object.values(gasCosts).filter(
        (gasCost) => gasCost.insufficient,
      );

      return gasCostResult;
    },
    {
      enabled: Boolean(account.address && route),
      refetchInterval,
      staleTime: refetchInterval,
      cacheTime: refetchInterval,
    },
  );

  const isInsufficientGas =
    Boolean(insufficientGas?.length) && !isRefuelLoading && !enabledRefuel;

  return {
    insufficientGas: isInsufficientGas ? insufficientGas : undefined,
    isInitialLoading,
  };
};
