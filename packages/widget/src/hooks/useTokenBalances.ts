import { TokenAmount } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { LiFi } from '../config/lifi';
import { useWallet } from '../providers/WalletProvider';
import { formatTokenAmount } from '../utils';
import { useChains } from './useChains';
import { useTokens } from './useTokens';

export const useTokenBalances = (selectedChainId: number) => {
  const { account } = useWallet();
  const { chains, isLoading: isChainsLoading } = useChains();
  const { tokens, isLoading } = useTokens(selectedChainId);

  const isBalanceLoadingEnabled =
    Boolean(account.address) && Boolean(tokens) && Boolean(chains);

  const {
    data: tokensWithBalance,
    isLoading: isBalanceLoading,
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
      return [
        ...formatedTokens
          .filter((token) => token.amount !== '0')
          .sort(
            (a, b) =>
              parseFloat(b.amount ?? '0') * parseFloat(b.priceUSD ?? '0') -
              parseFloat(a.amount ?? '0') * parseFloat(a.priceUSD ?? '0'),
          ),
        ...formatedTokens.filter((token) => token.amount === '0'),
      ];
    },
    {
      enabled: isBalanceLoadingEnabled,
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
    },
  );

  return {
    tokens: tokensWithBalance ?? (tokens as TokenAmount[] | undefined),
    isLoading: isLoading || isChainsLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    updateBalances: refetch,
  };
};
