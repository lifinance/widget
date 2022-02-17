import Lifi, {
  ChainKey,
  getChainById,
  Token,
  TokenAmount,
} from '@lifinance/sdk';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useWidgetConfig } from '../providers/WidgetProvider';
import { formatTokenAmount } from '../utils/format';
import { usePriorityAccount } from './connectorHooks';
import { useSwapPossibilities } from './useSwapPossibilities';

interface TokenAmountList {
  [ChainKey: string]: Array<TokenAmount>;
}

export const useTokens = (selectedChain: ChainKey) => {
  const { supportedChains } = useWidgetConfig();
  const account = usePriorityAccount();
  const { data: possibilities, isLoading } = useSwapPossibilities();

  const formatTokens = useCallback(
    (tokens: Token[] = []) => {
      const tokenAmountList: TokenAmountList = tokens.reduce<TokenAmountList>(
        (tokenAmountList, token) => {
          const chain = getChainById(token.chainId);
          if (!tokenAmountList[chain.key]) {
            tokenAmountList[chain.key] = [];
          }
          (token as TokenAmount).amount = formatTokenAmount(
            token,
            new BigNumber((token as TokenAmount).amount ?? 0),
          );
          tokenAmountList[chain.key].push({ amount: '0', ...token });
          return tokenAmountList;
        },
        {},
      );
      const filteredTokenAmountList = supportedChains.reduce<
        Array<TokenAmountList>
      >(
        (tokens, chain) => {
          if (tokenAmountList[chain.key]) {
            tokens[0][chain.key] = tokenAmountList[chain.key];
            tokens[1][chain.key] = tokenAmountList[chain.key].filter(
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
    refetch,
  } = useQuery(
    ['tokens', selectedChain, account],
    async ({ queryKey: [_, chainKey, account] }) => {
      if (!account || !possibilities) {
        return [];
      }
      const tokenBalances = await Lifi.getTokenBalances(
        account,
        tokens[chainKey as ChainKey],
      );

      const formatedTokens = formatTokens(
        tokenBalances.length === 0
          ? tokens[chainKey as ChainKey]
          : tokenBalances,
      );
      return formatedTokens;
    },
    {
      enabled: Boolean(account) && Boolean(possibilities),
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
    updateBalances: refetch,
  };
};
