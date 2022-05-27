import { TokenAmount } from '@lifinance/sdk';
import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { LiFi } from '../lifi';
import { useWallet } from '../providers/WalletProvider';
import { formatTokenAmount } from '../utils/format';
import { useToken } from './useToken';

export const useTokenBalance = (chainId: number, tokenAddress: string) => {
  const { account } = useWallet();
  const queryClient = useQueryClient();
  const { token } = useToken(chainId, tokenAddress);

  const {
    data: tokenWithBalance,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    ['token', account.address, chainId, tokenAddress],
    async ({ queryKey: [, address] }) => {
      if (!address || !token) {
        return null;
      }
      const tokenBalance = await LiFi.getTokenBalance(address as string, token);
      return {
        ...token,
        ...tokenBalance,
        amount: formatTokenAmount(tokenBalance?.amount),
      };
    },
    {
      enabled: Boolean(account.address) && Boolean(token),
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
      cacheTime: 60_000,
    },
  );

  const refetchBalance = useCallback(
    async (chainId?: number, tokenAddress?: string) => {
      if (!chainId && !tokenAddress) {
        refetch();
        return;
      }
      await queryClient.invalidateQueries(
        ['token', account.address, chainId, tokenAddress],
        { type: 'all', exact: true },
      );
    },
    [account.address, queryClient, refetch],
  );

  return {
    token: tokenWithBalance ?? (token as TokenAmount | undefined),
    isLoading,
    isFetching,
    refetchBalance,
  };
};
