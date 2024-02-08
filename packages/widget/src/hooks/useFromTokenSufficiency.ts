import type { RouteExtended } from '@lifi/sdk';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { parseUnits } from 'viem';
import { useFieldValues } from '../stores/form/useFieldValues.js';
import { isRouteDone } from '../stores/routes/utils.js';
import { useAccount } from './useAccount.js';
import { useTokenAddressBalance } from './useTokenAddressBalance.js';
import { getTokenBalancesWithRetry } from './useTokenBalance.js';

const refetchInterval = 30_000;

export const useFromTokenSufficiency = (route?: RouteExtended) => {
  const [fromChainId, fromTokenAddress, fromAmount] = useFieldValues(
    'fromChain',
    'fromToken',
    'fromAmount',
  );

  let chainId = fromChainId;
  let tokenAddress = fromTokenAddress;
  if (route) {
    chainId = route.fromToken.chainId;
    tokenAddress = route.fromToken.address;
  }

  const {
    token,
    chain,
    isLoading: isTokenAddressBalanceLoading,
  } = useTokenAddressBalance(chainId, tokenAddress);

  const { account } = useAccount({ chainType: chain?.chainType });

  const { data: insufficientFromToken, isLoading } = useQuery({
    queryKey: [
      'from-token-sufficiency-check',
      account.address,
      chainId,
      tokenAddress,
      route?.id ?? fromAmount,
    ] as const,
    queryFn: async ({ queryKey: [, accountAddress] }) => {
      if (!accountAddress || !token) {
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

      const tokenBalances = await getTokenBalancesWithRetry(accountAddress, [
        currentAction.fromToken,
      ]);

      currentTokenBalance = tokenBalances?.[0]?.amount ?? 0n;
      const insufficientFunds =
        BigInt(currentAction.fromAmount) > currentTokenBalance;
      return insufficientFunds;
    },

    enabled: Boolean(account.address && token && !isTokenAddressBalanceLoading),
    refetchInterval,
    staleTime: refetchInterval,
    placeholderData: keepPreviousData,
  });

  return {
    insufficientFromToken,
    isLoading,
  };
};
