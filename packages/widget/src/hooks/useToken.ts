import { ChainKey, getChainByKey } from '@lifinance/sdk';
import { useMemo } from 'react';
import { useSwapPossibilities } from './useSwapPossibilities';

export const useToken = (chainKey: ChainKey, tokenAddress: string) => {
  const { data: possibilities, isLoading } = useSwapPossibilities();

  const [chain, token] = useMemo(() => {
    const chain = getChainByKey(chainKey);
    const token = possibilities?.tokens.find(
      (token) => token.address === tokenAddress && token.chainId === chain.id,
    );
    return [chain, token];
  }, [chainKey, possibilities?.tokens, tokenAddress]);

  return {
    chain,
    token,
    isLoading,
  };
};
