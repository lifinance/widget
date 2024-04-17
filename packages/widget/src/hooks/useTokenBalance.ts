import type { ExtendedChain } from '@lifi/sdk';
import { getTokenBalances, type Token, type TokenAmount } from '@lifi/sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useAccount } from './useAccount.js';

const defaultRefetchInterval = 30_000;

export const useTokenBalance = (
  accountAddress?: string,
  token?: Token,
  chain?: ExtendedChain,
) => {
  const { account } = useAccount(
    // When we provide chain we want to be sure that account address used is from the same ecosystem as token
    chain ? { chainType: chain.chainType } : undefined,
  );
  const queryClient = useQueryClient();
  const walletAddress = accountAddress || account.address;

  const tokenBalanceQueryKey = useMemo(
    () =>
      ['token-balance', walletAddress, token?.chainId, token?.address] as const,
    [token?.address, token?.chainId, walletAddress],
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: tokenBalanceQueryKey,
    queryFn: async ({
      queryKey: [, accountAddress, tokenChainId, tokenAddress],
    }) => {
      const tokenBalances = await getTokenBalancesWithRetry(
        accountAddress as string,
        [token!],
      );

      if (!tokenBalances?.length) {
        throw Error('Could not get tokens balance.');
      }

      const cachedTokenAmount =
        queryClient.getQueryData<TokenAmount>(tokenBalanceQueryKey);

      const tokenAmount = tokenBalances[0].amount;

      if (cachedTokenAmount?.amount !== tokenAmount) {
        queryClient.setQueryDefaults(tokenBalanceQueryKey, {
          refetchInterval: defaultRefetchInterval,
          staleTime: defaultRefetchInterval,
        });
      }

      queryClient.setQueriesData<TokenAmount[]>(
        { queryKey: ['token-balances', accountAddress, tokenChainId] },
        (data) => {
          if (data) {
            const clonedData = [...data];
            const index = clonedData.findIndex(
              (dataToken) => dataToken.address === tokenAddress,
            );
            clonedData[index] = {
              ...clonedData[index],
              amount: tokenAmount,
            };
            return clonedData;
          }
        },
      );

      return {
        ...tokenBalances[0],
        amount: tokenAmount,
      } as TokenAmount;
    },

    enabled: Boolean(walletAddress && token),
    refetchInterval: defaultRefetchInterval,
    staleTime: defaultRefetchInterval,
  });

  const refetchAllBalances = () => {
    queryClient.refetchQueries({
      queryKey: ['token-balances', accountAddress, token?.chainId],
      exact: false,
    });
  };

  const refetchNewBalance = useCallback(() => {
    queryClient.setQueryDefaults(tokenBalanceQueryKey, {
      refetchInterval: 250,
      staleTime: 250,
    });
  }, [queryClient, tokenBalanceQueryKey]);

  return {
    token: data,
    isLoading,
    refetch,
    refetchNewBalance,
    refetchAllBalances,
    getTokenBalancesWithRetry,
  };
};

export const getTokenBalancesWithRetry = async (
  accountAddress: string,
  tokens: Token[],
  depth = 0,
): Promise<TokenAmount[] | undefined> => {
  try {
    const tokenBalances = await getTokenBalances(
      accountAddress as string,
      tokens,
    );
    if (!tokenBalances.every((token) => token.blockNumber)) {
      if (depth > 10) {
        console.warn('Token balance backoff depth exceeded.');
        return undefined;
      }
      await new Promise((resolve) => {
        setTimeout(resolve, 1.5 ** depth * 100);
      });
      return getTokenBalancesWithRetry(accountAddress, tokens, depth + 1);
    }
    return tokenBalances;
  } catch (error) {
    //
  }
};
