import LiFi from '@lifinance/sdk';
import { useQuery } from 'react-query';
import { useWalletInterface } from '../services/walletInterface';
import { useToken } from './useToken';

export const useTokenBalance = (chainId: number, tokenAddress: string) => {
  const { account } = useWalletInterface();
  const { token } = useToken(chainId, tokenAddress);

  const { data: tokenWithBalance, isLoading } = useQuery(
    ['token', tokenAddress, account.address],
    async ({ queryKey: [_, __, address] }) => {
      if (!address || !token) {
        return null;
      }
      const tokenBalance = await LiFi.getTokenBalance(address, token);
      return tokenBalance;
    },
    {
      enabled: Boolean(account.address) && Boolean(token),
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
      cacheTime: 60_000,
    },
  );

  return {
    token,
    tokenWithBalance,
    isLoading,
  };
};
