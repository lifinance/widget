/* eslint-disable consistent-return */
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LiFi } from '../config/lifi';
import { useWallet } from '../providers/WalletProvider';
import { Token } from '../types';
import { formatTokenAmount } from '../utils';
import { useFeaturedTokens } from './useFeaturedTokens';
import { useTokens } from './useTokens';

const defaultRefetchInterval = 60_000;
const minRefetchInterval = 1000;

export const useTokenBalances = (selectedChainId: number) => {
  const { account } = useWallet();
  const featuredTokens = useFeaturedTokens(selectedChainId);
  const { tokens, isLoading } = useTokens(selectedChainId);
  const [refetchInterval, setRefetchInterval] = useState(
    defaultRefetchInterval,
  );

  const isBalanceLoadingEnabled =
    Boolean(account.address) && Boolean(tokens?.length);

  const {
    data: tokensWithBalance,
    isLoading: isBalanceLoading,
    isFetched: isBalanceFetched,
    refetch,
  } = useQuery(
    ['token-balances', selectedChainId, account.address, tokens?.length],
    async ({ queryKey: [, , accountAddress] }) => {
      if (!accountAddress || !tokens) {
        return;
      }
      const tokenBalances = await LiFi.getTokenBalances(
        accountAddress as string,
        tokens,
      );

      if (!tokenBalances?.length) {
        // Sometimes RPCs (e.g. Arbitrum) don't return balances on first call
        // TODO: fix and remove backplane
        setRefetchInterval((interval) =>
          interval === defaultRefetchInterval
            ? minRefetchInterval
            : interval * 2,
        );
        return;
      }

      const featuredTokenAddresses = new Set(
        featuredTokens?.map((token) => token.address),
      );

      const sortFn = (a: Token, b: Token) =>
        parseFloat(b.amount ?? '0') * parseFloat(b.priceUSD ?? '0') -
        parseFloat(a.amount ?? '0') * parseFloat(a.priceUSD ?? '0');

      const formattedTokens = (
        (tokenBalances.length === 0 ? tokens : tokenBalances) as Token[]
      ).map((token) => {
        token.amount = formatTokenAmount(token.amount);
        return token;
      });
      return [
        ...formattedTokens
          .filter(
            (token) =>
              token.amount !== '0' && featuredTokenAddresses.has(token.address),
          )
          .sort(sortFn),
        ...formattedTokens.filter(
          (token) =>
            token.amount === '0' && featuredTokenAddresses.has(token.address),
        ),
        ...formattedTokens
          .filter(
            (token) =>
              token.amount !== '0' &&
              !featuredTokenAddresses.has(token.address),
          )
          .sort(sortFn),
        ...formattedTokens.filter(
          (token) =>
            token.amount === '0' && !featuredTokenAddresses.has(token.address),
        ),
      ];
    },
    {
      enabled: isBalanceLoadingEnabled,
      refetchIntervalInBackground: true,
      refetchInterval,
      staleTime: refetchInterval,
    },
  );

  return {
    tokens,
    tokensWithBalance,
    featuredTokens,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    isBalanceFetched,
    updateBalances: refetch,
  };
};
