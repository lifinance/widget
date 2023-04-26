import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';

export const useTokenAddressBalance = (
  chainId?: number,
  tokenAddress?: string,
) => {
  const { tokens, tokensWithBalance, isBalanceLoading, refetch } =
    useTokenBalances(chainId);

  const token = useMemo(() => {
    if (tokenAddress && chainId) {
      const token = (tokensWithBalance ?? tokens)?.find(
        (token) => token.address === tokenAddress && token.chainId === chainId,
      );
      return token;
    }
  }, [chainId, tokenAddress, tokens, tokensWithBalance]);

  return {
    token,
    isLoading: isBalanceLoading,
    refetch,
  };
};
