import type { StatusResponse } from '@lifi/sdk';
import { useLiFi } from '../providers';
import { useQuery } from '@tanstack/react-query';

export const useTransactionHistory = (
  address?: string,
): { data: StatusResponse[]; isLoading: boolean; refetch: () => void } => {
  const lifi = useLiFi();

  const cacheKey = 'transaction-history';

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
