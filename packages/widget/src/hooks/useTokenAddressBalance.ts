import { useMemo } from 'react';
import { useTokenBalances } from './useTokenBalances';

export const useTokenAddressBalance = (
  chainId?: number,
  tokenAddress?: string,
) => {
  const { tokens, tokensWithBalance, isBalanceLoading, refetch } =
    useTokenBalances(chainId);

  const token = useMemo(() => {
    console.log('useTokenAddressBalance');
    const token = (tokensWithBalance ?? tokens)?.find(
      (token) => token.address === tokenAddress && token.chainId === chainId,
    );
    return token;
  }, [chainId, tokenAddress, tokens, tokensWithBalance]);

  return {
    token,
    isLoading: isBalanceLoading,
    refetch,
  };
};
