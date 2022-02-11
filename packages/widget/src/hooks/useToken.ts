import Lifi, { Chain, getChainById, TokenAmount } from '@lifinance/sdk';
import { useQuery } from 'react-query';
import { useWidgetConfig } from '../providers/WidgetProvider';
import { usePriorityAccount } from './connectorHooks';
import { useSwapPossibilities } from './useSwapPossibilities';

interface TokenAmountList {
  [ChainKey: string]: Array<TokenAmount>;
}

const filterTokenAmountList = (
  supportedChains: Chain[],
  tokenAmountList: TokenAmountList,
) => {};

export const useTokens = () => {
  const { supportedChains } = useWidgetConfig();
  const account = usePriorityAccount();
  const { data: possibilities } = useSwapPossibilities();
  const { data: tokens, refetch } = useQuery(
    'tokens',
    async () => {
      if (!account || !possibilities) {
        return {};
      }
      const a = performance.now();
      const tokens = await Lifi.getTokenBalances(account, possibilities.tokens);
      const tokenAmountList: TokenAmountList = tokens.reduce<TokenAmountList>(
        (tokenAmountList, token) => {
          const chain = getChainById(token.chainId);
          if (!tokenAmountList[chain.key]) {
            tokenAmountList[chain.key] = [];
          }
          tokenAmountList[chain.key].push(token);
          return tokenAmountList;
        },
        {},
      );
      const filteredTokenAmountList = supportedChains.reduce<TokenAmountList>(
        (tokens, chain) => {
          if (tokenAmountList[chain.key]) {
            tokens[chain.key] = tokenAmountList[chain.key];
          }
          return tokens;
        },
        {},
      );
      const b = performance.now();
      console.log('performance', b - a);
      return filteredTokenAmountList;
    },
    {
      enabled: Boolean(account) && Boolean(possibilities),
      refetchInterval: 60_000,
      // initialData: () => {
      //   if (!possibilities) {
      //     return {};
      //   }
      //   const tokenAmountList = possibilities.tokens.reduce<TokenAmountList>(
      //     (tokenAmountList, token) => {
      //       const chain = getChainById(token.chainId);
      //       if (!tokenAmountList[chain.key]) {
      //         tokenAmountList[chain.key] = [];
      //       }
      //       tokenAmountList[chain.key].push({ ...token, amount: '' });
      //       return tokenAmountList;
      //     },
      //     {},
      //   );
      //   const filteredTokenAmountList = supportedChains.reduce<TokenAmountList>(
      //     (tokens, chain) => {
      //       if (tokenAmountList[chain.key]) {
      //         tokens[chain.key] = tokenAmountList[chain.key];
      //       }
      //       return tokens;
      //     },
      //     {},
      //   );
      //   return filteredTokenAmountList;
      // },
    },
  );

  return { tokens, updateBalances: refetch };
};
