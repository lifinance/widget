import LiFi from '@lifinance/sdk';
import { useQuery } from 'react-query';
import { useWalletInterface } from '../services/walletInterface';
import { useToken } from './useToken';

export const useTokenBalance = (chainId: number, tokenAddress: string) => {
  const { accountInformation } = useWalletInterface();
  const { token } = useToken(chainId, tokenAddress);

  const { data: tokenWithBalance, isLoading } = useQuery(
    ['token', token?.symbol, accountInformation.account],
    async ({ queryKey: [_, tokenSymbol, account] }) => {
      if (!account || !token) {
        return null;
      }
      const tokenBalance = await LiFi.getTokenBalance(account, token);
      return tokenBalance;
    },
    {
      enabled: Boolean(accountInformation.account) && Boolean(token),
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
    },
  );

  return {
    token,
    tokenWithBalance,
    isLoading,
  };
};
