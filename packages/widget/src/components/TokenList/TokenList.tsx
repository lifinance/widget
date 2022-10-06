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
    320,
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

  const tokenSearchEnabled =
    !isTokensLoading &&
    !filteredTokens.length &&
    !!tokenSearchFilter &&
    !!selectedChainId;

  const { token: searchedToken, isLoading: isSearchedTokenLoading } =
    useTokenSearch(selectedChainId, tokenSearchFilter, tokenSearchEnabled);

  const isLoading =
    isTokensLoading || (tokenSearchEnabled && isSearchedTokenLoading);

  const tokens = filteredTokens.length
    ? filteredTokens
    : searchedToken
    ? [searchedToken]
    : filteredTokens;

  const handleTokenClick = useCallback(
    (tokenAddress: string) => {
      setValue(SwapFormKeyHelper.getTokenKey(formType), tokenAddress, {
        shouldTouch: true,
      });
      // Set chain again to trigger URL builder update
      setValue(SwapFormKeyHelper.getChainKey(formType), selectedChainId, {
        shouldTouch: true,
      });
      setValue(SwapFormKeyHelper.getAmountKey(formType), '');
      const oppositeFormType = formType === 'from' ? 'to' : 'from';
      const [selectedOppositeToken, selectedOppositeChainId] = getValues([
        SwapFormKeyHelper.getTokenKey(oppositeFormType),
        SwapFormKeyHelper.getChainKey(oppositeFormType),
      ]);
      if (
        selectedOppositeToken === tokenAddress &&
        selectedOppositeChainId === selectedChainId
      ) {
        setValue(SwapFormKeyHelper.getTokenKey(oppositeFormType), '', {
          shouldTouch: true,
        });
      }
      onClick?.();
    },
    [formType, getValues, onClick, selectedChainId, setValue],
  );

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
        isLoading={isLoading}
        isBalanceLoading={isBalanceLoading}
        showBalance={account.isActive}
        showFeatured={!tokenSearchFilter}
        onClick={handleTokenClick}
      />
    </Box>
  );
};
