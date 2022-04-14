import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { LiFi } from '../lifi';

export const useToken = (chainId: number, tokenAddress: string) => {
  const { data, isLoading } = useQuery(['tokens'], () =>
    LiFi.getPossibilities({ include: ['tokens'] }),
  );

  const token = useMemo(() => {
    const token = data?.tokens?.find(
      (token) => token.address === tokenAddress && token.chainId === chainId,
    );
    return token;
  }, [chainId, data?.tokens, tokenAddress]);

  return {
    token,
    isLoading,
  };
};
