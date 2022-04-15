import { Token, TokenAmount } from '@lifinance/sdk';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { LiFi } from '../lifi';
import { useWallet } from '../providers/WalletProvider';
import { formatTokenAmount } from '../utils/format';
import { useChains } from './useChains';

interface TokenAmountList {
  [chainId: number]: Array<TokenAmount>;
}

export const useTokens = (selectedChainId: number) => {
  const { account } = useWallet();
  const { chains, isLoading: isChainsLoading, getChainById } = useChains();
  const { data, isLoading } = useQuery(['tokens'], () =>
    LiFi.getPossibilities({ include: ['tokens'] }),
  );

  const formatTokens = useCallback(
    (tokens: Token[] = []) => {
      if (!chains) {
        return [];
      }
      const tokenAmountList: TokenAmountList = tokens.reduce<TokenAmountList>(
        (tokenAmountList, token) => {
          const chain = getChainById(token.chainId);
          if (!chain) {
            return tokenAmountList;
          }
          if (!tokenAmountList[chain.id]) {
            tokenAmountList[chain.id] = [];
          }
          (token as TokenAmount).amount = formatTokenAmount(
            (token as TokenAmount).amount,
          );
          tokenAmountList[chain.id].push({ amount: '0', ...token });
          return tokenAmountList;
        },
        {},
      );
      const filteredTokenAmountList = chains.reduce<Array<TokenAmountList>>(
        (tokens, chain) => {
          if (tokenAmountList[chain.id]) {
            tokens[0][chain.id] = tokenAmountList[chain.id];
            tokens[1][chain.id] = tokenAmountList[chain.id].filter(
              (token) => token.amount !== '0',
            );
          }
          return tokens;
        },
        [{}, {}],
      );

      return filteredTokenAmountList;
    },
    [chains, getChainById],
  );

  const [tokens] = useMemo(
    () => formatTokens(data?.tokens),
    [formatTokens, data?.tokens],
  );

  const {
    data: tokensWithBalance,
    isLoading: isBalancesLoading,
    isFetching: isBalancesFetching,
    refetch,
  } = useQuery(
    ['tokens', selectedChainId, account.address],
    async ({ queryKey: [_, chainId, account] }) => {
      if (!account || !data) {
        return [];
      }
      const tokenBalances = await LiFi.getTokenBalances(
        account as string,
        tokens[chainId as number],
      );

      const formatedTokens = formatTokens(
        tokenBalances.length === 0 ? tokens[chainId as number] : tokenBalances,
      );
      return formatedTokens;
    },
    {
      enabled: Boolean(account.address) && Boolean(data) && Boolean(chains),
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
    },
  );

  return {
    tokens: tokensWithBalance?.[0] ?? tokens,
    tokensWithBalance: tokensWithBalance?.[1],
    isLoading: isLoading || isChainsLoading,
    isBalancesLoading: isLoading || isChainsLoading || isBalancesLoading,
    isBalancesFetching,
    updateBalances: refetch,
  };
};
