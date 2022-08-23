import { Box } from '@mui/material';
import type { FC } from 'react';
import { useCallback, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  useDebouncedWatch,
  useTokenBalances,
  useTokenSearch,
} from '../../hooks';
import { SwapFormKey, SwapFormKeyHelper, useWallet } from '../../providers';
import type { Token } from '../../types';
import { TokenNotFound } from './TokenNotFound';
import type { TokenListProps } from './types';
import { VirtualizedTokenList } from './VirtualizedTokenList';

export const TokenList: FC<TokenListProps> = ({
  formType,
  height,
  onClick,
}) => {
  const parentRef = useRef<HTMLUListElement | null>(null);
  const { account } = useWallet();
  const { setValue, getValues } = useFormContext();
  const [selectedChainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType)],
  });
  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    [SwapFormKey.TokenSearchFilter],
    250,
  );

  const {
    tokens: chainTokens,
    tokensWithBalance,
    isLoading: isTokensLoading,
    isBalanceLoading,
    featuredTokens,
  } = useTokenBalances(selectedChainId);

  let filteredTokens = (tokensWithBalance ?? chainTokens ?? []) as Token[];
  const searchFilter = tokenSearchFilter?.toUpperCase() ?? '';
  filteredTokens = tokenSearchFilter
    ? filteredTokens.filter(
        (token) =>
          token.name.toUpperCase().includes(searchFilter) ||
          token.symbol.toUpperCase().includes(searchFilter) ||
          token.address.toUpperCase().includes(searchFilter),
      )
    : filteredTokens;

  const tokenSearchEnabled = !filteredTokens.length && !isTokensLoading;

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(tokenSearchFilter, selectedChainId, tokenSearchEnabled);

  const isLoading =
    isTokensLoading || (tokenSearchEnabled && isSearchedTokenLoading);

  const tokens = filteredTokens.length
    ? filteredTokens
    : searchedToken
    ? [searchedToken]
    : filteredTokens;

  const handleTokenClick = useCallback(
    (tokenAddress: string) => {
      setValue(SwapFormKeyHelper.getTokenKey(formType), tokenAddress);
      setValue(SwapFormKeyHelper.getAmountKey(formType), '');
      const oppositeFormType = formType === 'from' ? 'to' : 'from';
      const [selectedOppositeToken, selectedOppositeChain, selectedChain] =
        getValues([
          SwapFormKeyHelper.getTokenKey(oppositeFormType),
          SwapFormKeyHelper.getChainKey(oppositeFormType),
          SwapFormKeyHelper.getChainKey(formType),
        ]);
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChain === selectedChain
      ) {
        setValue(SwapFormKeyHelper.getTokenKey(oppositeFormType), '');
      }
      onClick?.();
    },
    [formType, getValues, onClick, setValue],
  );

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      {!tokens.length && !isLoading ? <TokenNotFound /> : null}
      <VirtualizedTokenList
        tokens={tokens}
        featuredTokensLength={featuredTokens?.length}
        scrollElementRef={parentRef}
        chainId={selectedChainId}
        isLoading={isLoading}
        isBalanceLoading={isBalanceLoading}
        showBalance={account.isActive}
        showFeatured={!tokenSearchFilter}
        onClick={handleTokenClick}
      />
    </Box>
  );
};
