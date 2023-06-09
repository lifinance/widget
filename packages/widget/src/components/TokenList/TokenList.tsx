import { Box } from '@mui/material';
import type { FC } from 'react';
import { useRef } from 'react';
import { useWatch } from 'react-hook-form';
import {
  useChain,
  useDebouncedWatch,
  useTokenBalances,
  useTokenSearch,
} from '../../hooks';
import { FormKey, FormKeyHelper, useWallet } from '../../providers';
import type { TokenAmount } from '../../types';
import { TokenNotFound } from './TokenNotFound';
import { VirtualizedTokenList } from './VirtualizedTokenList';
import type { TokenListProps } from './types';
import { useTokenSelect } from './useTokenSelect';

export const TokenList: FC<TokenListProps> = ({
  formType,
  height,
  onClick,
}) => {
  const parentRef = useRef<HTMLUListElement | null>(null);
  const { account } = useWallet();
  const [selectedChainId] = useWatch({
    name: [FormKeyHelper.getChainKey(formType)],
  });
  const [tokenSearchFilter]: string[] = useDebouncedWatch(
    [FormKey.TokenSearchFilter],
    320,
  );

  const { chain, isLoading: isChainLoading } = useChain(selectedChainId);

  const {
    tokens: chainTokens,
    tokensWithBalance,
    isLoading: isTokensLoading,
    isBalanceLoading,
    featuredTokens,
  } = useTokenBalances(selectedChainId);

  let filteredTokens = (tokensWithBalance ??
    chainTokens ??
    []) as TokenAmount[];
  const searchFilter = tokenSearchFilter?.toUpperCase() ?? '';
  filteredTokens = tokenSearchFilter
    ? filteredTokens.filter(
        (token) =>
          token.name.toUpperCase().includes(searchFilter) ||
          token.symbol.toUpperCase().includes(searchFilter) ||
          token.address.toUpperCase().includes(searchFilter),
      )
    : filteredTokens;

  const tokenSearchEnabled =
    !isTokensLoading &&
    !filteredTokens.length &&
    !!tokenSearchFilter &&
    !!selectedChainId;

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(selectedChainId, tokenSearchFilter, tokenSearchEnabled);

  const isLoading =
    isTokensLoading ||
    isChainLoading ||
    (tokenSearchEnabled && isSearchedTokenLoading);

  const tokens = filteredTokens.length
    ? filteredTokens
    : searchedToken
    ? [searchedToken]
    : filteredTokens;

  const handleTokenClick = useTokenSelect(formType, onClick);

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      {!tokens.length && !isLoading ? (
        <TokenNotFound formType={formType} />
      ) : null}
      <VirtualizedTokenList
        tokens={tokens}
        featuredTokensLength={featuredTokens?.length}
        scrollElementRef={parentRef}
        chainId={selectedChainId}
        chain={chain}
        isLoading={isLoading}
        isBalanceLoading={isBalanceLoading}
        showBalance={account.isActive}
        showFeatured={!tokenSearchFilter}
        onClick={handleTokenClick}
      />
    </Box>
  );
};
