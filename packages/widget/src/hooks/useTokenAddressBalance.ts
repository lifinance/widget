import { useMemo } from 'react';
import type { TokenAmount } from '../types';
import { useTokenBalances } from './useTokenBalances';

export const useTokenAddressBalance = (
  chainId?: number,
  tokenAddress?: string,
) => {
  const { tokens, tokensWithBalance, chain, isBalanceLoading, refetch } =
    useTokenBalances(chainId);

  const token = useMemo(() => {
    if (tokenAddress && chainId) {
      const token = (tokensWithBalance ?? tokens)?.find(
        (token) => token.address === tokenAddress && token.chainId === chainId,
      );
      return token as TokenAmount;
    }
  }, [chainId, tokenAddress, tokens, tokensWithBalance]);

  return {
    token,
    chain,
    isLoading: isBalanceLoading,
    refetch,
  };
};
