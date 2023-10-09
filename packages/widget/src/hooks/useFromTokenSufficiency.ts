import type { Route } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useWatch } from 'react-hook-form';
import { parseUnits } from 'viem';
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
      const parsedFromAmount = parseUnits(fromAmount, token.decimals);
      let currentTokenBalance = token.amount ?? 0n;

      if (!route || isRouteDone(route)) {
        const insufficientFunds = currentTokenBalance < parsedFromAmount;
        return insufficientFunds;
      }

      const currentAction = route.steps.filter(
        (step) => !step.execution || step.execution.status !== 'DONE',
      )[0]?.action;

      if (
        token.chainId === currentAction.fromToken.chainId &&
        token.address === currentAction.fromToken.address &&
        currentTokenBalance > 0
      ) {
        const insufficientFunds =
          BigInt(route.fromAmount) > currentTokenBalance;
        return insufficientFunds;
      }

      const tokenBalances = await getTokenBalancesWithRetry(account.address, [
        currentAction.fromToken,
      ]);

      currentTokenBalance = tokenBalances?.[0]?.amount ?? 0n;
      const insufficientFunds =
        BigInt(currentAction.fromAmount) > currentTokenBalance;
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
