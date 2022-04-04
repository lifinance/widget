import { getChainById } from '@lifinance/sdk';
import { useMemo } from 'react';
import { useSwapPossibilities } from './useSwapPossibilities';

export const useToken = (chainId: number, tokenAddress: string) => {
  const { data: possibilities, isLoading } = useSwapPossibilities('tokens');

  const [chain, token] = useMemo(() => {
    const chain = getChainById(chainId);
    const token = possibilities?.tokens?.find(
      (token) => token.address === tokenAddress && token.chainId === chain.id,
    );
    return [chain, token];
  }, [chainId, possibilities?.tokens, tokenAddress]);

  return {
    chain,
    token,
    isLoading,
  };
};
