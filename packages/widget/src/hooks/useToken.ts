import { useMemo } from 'react';
import { useTokens } from './useTokens';

export const useToken = (chainId: number, tokenAddress: string) => {
  const { tokens, isLoading, isFetching } = useTokens(chainId);

  const token = useMemo(() => {
    const token = tokens?.find(
      (token) => token.address === tokenAddress && token.chainId === chainId,
    );
    return token;
  }, [chainId, tokenAddress, tokens]);

  return {
    token,
    isLoading,
    isFetching,
  };
};
