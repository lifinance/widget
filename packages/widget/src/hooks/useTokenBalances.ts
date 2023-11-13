import { getTokenBalances } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import type { TokenAmount } from '../types';
import { useAccount } from './useAccount';
import { useFeaturedTokens } from './useFeaturedTokens';
import { useTokens } from './useTokens';

const defaultRefetchInterval = 32_000;

export const useTokenBalances = (selectedChainId?: number) => {
  const { accounts } = useAccount();
  const featuredTokens = useFeaturedTokens(selectedChainId);
  const { tokens, chain, isLoading } = useTokens(selectedChainId);

  const account = accounts.find(
    (account) => account.chainType === chain?.chainType,
  );
  const isBalanceLoadingEnabled =
    Boolean(account?.address) &&
    Boolean(tokens?.length) &&
    Boolean(selectedChainId);

  const {
    data: tokensWithBalance,
    isLoading: isBalanceLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'token-balances',
      account?.address,
      selectedChainId,
      tokens?.length,
    ],
    queryFn: async ({ queryKey: [, accountAddress] }) => {
      const tokenBalances = await getTokenBalances(
        accountAddress as string,
        tokens!,
      );

      const featuredTokenAddresses = new Set(
        featuredTokens?.map((token) => token.address),
      );

      const sortFn = (a: TokenAmount, b: TokenAmount) =>
        parseFloat(formatUnits(b.amount ?? 0n, b.decimals)) *
          parseFloat(b.priceUSD ?? '0') -
        parseFloat(formatUnits(a.amount ?? 0n, a.decimals)) *
          parseFloat(a.priceUSD ?? '0');
      const formattedTokens = (
        tokenBalances.length === 0 ? tokens : tokenBalances
      ) as TokenAmount[];

      const result = [
        ...formattedTokens
          .filter(
            (token) =>
              token.amount && featuredTokenAddresses.has(token.address),
          )
          .sort(sortFn),
        ...formattedTokens.filter(
          (token) => !token.amount && featuredTokenAddresses.has(token.address),
        ),
        ...formattedTokens
          .filter(
            (token) =>
              token.amount && !featuredTokenAddresses.has(token.address),
          )
          .sort(sortFn),
        ...formattedTokens.filter(
          (token) =>
            !token.amount && !featuredTokenAddresses.has(token.address),
        ),
      ];
      return result;
    },
    enabled: isBalanceLoadingEnabled,
    refetchInterval: defaultRefetchInterval,
    staleTime: defaultRefetchInterval,
  });

  return {
    tokens,
    tokensWithBalance,
    featuredTokens,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    refetch,
  };
};
