import type { Route } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import Big from 'big.js';
import { useWatch } from 'react-hook-form';
import { FormKey, useWallet } from '../providers';
import { isRouteDone } from '../stores';
import { useGetTokenBalancesWithRetry } from './useGetTokenBalancesWithRetry';
import { useTokenAddressBalance } from './useTokenAddressBalance';

const refetchInterval = 30_000;

export const useFromTokenSufficiency = (route?: Route) => {
  const { account } = useWallet();
  const getTokenBalancesWithRetry = useGetTokenBalancesWithRetry(
    account.signer?.provider,
  );
  const [fromChainId, fromTokenAddress, fromAmount] = useWatch({
    name: [FormKey.FromChain, FormKey.FromToken, FormKey.FromAmount],
  });

  let chainId = fromChainId;
  let tokenAddress = fromTokenAddress;
  if (route) {
    chainId = route.fromToken.chainId;
    tokenAddress = route.fromToken.address;
  }

  const { token, isLoading } = useTokenAddressBalance(chainId, tokenAddress);

  const { data: insufficientFromToken, isInitialLoading } = useQuery(
    [
      'from-token-sufficiency-check',
      account.address,
      chainId,
      tokenAddress,
      route?.id ?? fromAmount,
    ],
    async () => {
      if (!account.address || !token) {
        return;
      }
      let currentTokenBalance = Big(token?.amount || 0);

      if (!route || isRouteDone(route)) {
        const insufficientFunds = currentTokenBalance.lt(Big(fromAmount || 0));
        return insufficientFunds;
      }

      const currentAction = route.steps.filter(
        (step) => !step.execution || step.execution.status !== 'DONE',
      )[0]?.action;

      if (
        token.chainId === currentAction.fromToken.chainId &&
        token.address === currentAction.fromToken.address &&
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

      currentTokenBalance = Big(tokenBalances?.[0]?.amount || 0);
      const insufficientFunds = Big(currentAction.fromAmount)
        .div(10 ** currentAction.fromToken.decimals)
        .gt(currentTokenBalance);
      return insufficientFunds;
    },
    {
      enabled: Boolean(account.address && token && !isLoading),
      refetchInterval,
      staleTime: refetchInterval,
      cacheTime: refetchInterval,
      keepPreviousData: true,
    },
  );

  return {
    insufficientFromToken,
    isInitialLoading,
  };
};
