import LiFi, { getChainById, Token, TokenAmount } from '@lifinance/sdk';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useWidgetConfig } from '../providers/WidgetProvider';
import { useWalletInterface } from '../services/walletInterface';
import { formatTokenAmount } from '../utils/format';
import { useSwapPossibilities } from './useSwapPossibilities';

interface TokenAmountList {
  [chainId: number]: Array<TokenAmount>;
}

export const useTokens = (selectedChainId: number) => {
  const { supportedChains } = useWidgetConfig();
  const { accountInformation } = useWalletInterface();
  const { data: possibilities, isLoading } = useSwapPossibilities();

  const formatTokens = useCallback(
    (tokens: Token[] = []) => {
      const tokenAmountList: TokenAmountList = tokens.reduce<TokenAmountList>(
        (tokenAmountList, token) => {
          const chain = getChainById(token.chainId);
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
      const filteredTokenAmountList = supportedChains.reduce<
        Array<TokenAmountList>
      >(
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
    [supportedChains],
  );

  const [tokens] = useMemo(
    () => formatTokens(possibilities?.tokens),
    [formatTokens, possibilities?.tokens],
  );

  const {
    data: tokensWithBalance,
    isLoading: isBalancesLoading,
    isFetching: isBalancesFetching,
    refetch,
  } = useQuery(
    ['tokens', selectedChainId, accountInformation.account],
    async ({ queryKey: [_, chainId, account] }) => {
      if (!account || !possibilities) {
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
      enabled: Boolean(accountInformation.account) && Boolean(possibilities),
      refetchIntervalInBackground: true,
      refetchInterval: 60_000,
      staleTime: 60_000,
    },
  );

  return {
    tokens: tokensWithBalance?.[0] ?? tokens,
    tokensWithBalance: tokensWithBalance?.[1],
    isLoading,
    isBalancesLoading: isLoading || isBalancesLoading,
    isBalancesFetching,
    updateBalances: refetch,
  };
};
