/* eslint-disable consistent-return */
import { TokenAmount } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { LiFi } from '../config/lifi';
import { useWallet } from '../providers/WalletProvider';
import { formatTokenAmount } from '../utils';
import { useTokens } from './useTokens';

const defaultRefetchInterval = 60_000;
const minRefetchInterval = 1000;

export const useTokenBalances = (selectedChainId: number) => {
  const { account } = useWallet();
  const { tokens, isLoading } = useTokens(selectedChainId);
  const [refetchInterval, setRefetchInterval] = useState(
    defaultRefetchInterval,
  );

  const isBalanceLoadingEnabled = Boolean(account.address) && Boolean(tokens);

  const {
    data: tokensWithBalance,
    isLoading: isBalanceLoading,
    isFetched: isBalanceFetched,
    refetch,
  } = useQuery(
    ['token-balances', selectedChainId, account.address],
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
      refetchInterval,
      staleTime: refetchInterval,
    },
  );

  return {
    tokens,
    tokensWithBalance,
    isLoading,
    isBalanceLoading: isBalanceLoading && isBalanceLoadingEnabled,
    isBalanceFetched,
    updateBalances: refetch,
  };
};
