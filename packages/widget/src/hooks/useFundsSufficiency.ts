import type { Route } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import Big from 'big.js';
import { useWallet } from '../providers';
import { isRouteDone } from '../stores';
import { useGetTokenBalancesWithRetry } from './useGetTokenBalancesWithRetry';
import { useTokenBalance } from './useTokenBalance';

const refetchInterval = 30_000;

export const useFundsSufficiency = (route?: Route) => {
  const { account } = useWallet();
  const getTokenBalancesWithRetry = useGetTokenBalancesWithRetry();
  const { token: fromToken } = useTokenBalance(route?.fromToken);

  const { data: insufficientFunds, isInitialLoading } = useQuery(
    ['funds-sufficiency-check', account.address, route?.id],
    async () => {
      if (!account.address || !fromToken || !route || isRouteDone(route)) {
        return;
      }
      let currentTokenBalance = Big(fromToken?.amount ?? 0);
      const currentAction = route.steps.filter(
        (step) => !step.execution || step.execution.status !== 'DONE',
      )[0]?.action;

      if (
        fromToken.chainId === currentAction.fromToken.chainId &&
        fromToken.address === currentAction.fromToken.address &&
        currentTokenBalance.gt(0)
      ) {
        const insufficientFunds = Big(route.fromAmount)
          .div(10 ** route.fromToken.decimals)
          .gt(currentTokenBalance);
        return insufficientFunds;
      }

      const tokenBalances = await getTokenBalancesWithRetry(account.address, [
        currentAction.fromToken,
      ]);

      currentTokenBalance = Big(tokenBalances?.[0]?.amount ?? 0);
      const insufficientFunds = Big(currentAction.fromAmount)
        .div(10 ** currentAction.fromToken.decimals)
        .gt(currentTokenBalance);
      return insufficientFunds;
    },
    {
      enabled: Boolean(account.address && route && fromToken),
      refetchInterval,
      staleTime: refetchInterval,
      cacheTime: refetchInterval,
    },
  );

  return {
    insufficientFunds,
    isInitialLoading,
  };
};
