import type { StatusResponse, Token, TokenAmount } from '@lifi/sdk';
import { useLiFi } from '../providers';
import { useQuery } from '@tanstack/react-query';

export const useTransactionHistory = (
  address?: string,
): { data: StatusResponse[]; isLoading: boolean; refetch: () => void } => {
  const lifi = useLiFi();

  const cacheKey = 'transaction-history';

  console.log('Copming here ateladst');

  const { data, isLoading, refetch } = useQuery(
    [cacheKey, address],
    async () => {
      if (!address) return [];

      const response = await lifi.getTransactionHistory(address);

      return response;
    },
  );

  return {
    data: data ?? [],
    isLoading,
    refetch,
  };
};
