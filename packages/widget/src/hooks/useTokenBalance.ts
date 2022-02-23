import Lifi, { ChainKey } from '@lifinance/sdk';
import { useQuery } from 'react-query';
import { useWalletInterface } from '../services/walletInterface';
import { useToken } from './useToken';

export const useTokenBalance = (chainKey: ChainKey, tokenAddress: string) => {
  const { accountInformation } = useWalletInterface();
  const { token } = useToken(chainKey, tokenAddress);

  const { data: tokenWithBalance, isFetching } = useQuery(
    ['token', token?.symbol, accountInformation.account],
    async ({ queryKey: [_, tokenSymbol, account] }) => {
      if (!account || !token) {
        return null;
      }
      const tokenBalance = await Lifi.getTokenBalance(account, token);
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
    isFetching,
  };
};
