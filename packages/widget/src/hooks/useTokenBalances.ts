import { TokenAmount } from '@lifinance/sdk';
import { useQuery } from 'react-query';
import { LiFi } from '../lifi';
import { useWallet } from '../providers/WalletProvider';
import { formatTokenAmount } from '../utils/format';
import { useChains } from './useChains';
import { useTokens } from './useTokens';

export const useTokenBalances = (selectedChainId: number) => {
  const { account } = useWallet();
  const { chains, isLoading: isChainsLoading } = useChains();
  const { tokens, isLoading, isFetching } = useTokens(selectedChainId);

  const isBalancesLoadingEnabled =
    Boolean(account.address) && Boolean(tokens) && Boolean(chains);

  const {
    data: tokensWithBalance,
    isLoading: isBalancesLoading,
    isFetching: isBalancesFetching,
    refetch,
  } = useQuery(
    ['token-balances', selectedChainId, account.address],
    async ({ queryKey: [_, chainId, account] }) => {
      if (!account || !tokens) {
        return [];
      }
      const tokenBalances = await LiFi.getTokenBalances(
        account as string,
        tokens,
      );

      const formatedTokens = (
        tokenBalances.length === 0 ? (tokens as TokenAmount[]) : tokenBalances
      ).map((token) => {
        token.amount = formatTokenAmount(token.amount);
        return token;
      });
      return formatedTokens;
    },
    {
      enabled: isBalancesLoadingEnabled,
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
    },
  );

  return {
    tokens: tokensWithBalance ?? tokens,
    tokensWithBalance,
    isLoading: (isLoading && isFetching) || isChainsLoading,
    isBalancesLoading:
      (isLoading && isFetching) ||
      isChainsLoading ||
      (isBalancesLoading && isBalancesLoadingEnabled),
    isBalancesFetching,
    updateBalances: refetch,
  };
};
