import type { RouteExtended } from '@lifi/sdk';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { parseUnits } from 'viem';
import { isRouteDone, useFieldValues } from '../stores';
import { useAccount } from './useAccount';
import { useTokenAddressBalance } from './useTokenAddressBalance';
import { getTokenBalancesWithRetry } from './useTokenBalance';

const refetchInterval = 30_000;

export const useFromTokenSufficiency = (route?: RouteExtended) => {
  const { account } = useAccount();
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

  const { token, isLoading: isTokenAddressBalanceLoading } =
    useTokenAddressBalance(chainId, tokenAddress);

  const { data: insufficientFromToken, isLoading } = useQuery({
    queryKey: [
      'from-token-sufficiency-check',
      account.address,
      chainId,
      tokenAddress,
      route?.id ?? fromAmount,
    ],
    queryFn: async () => {
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
