import { TokenAmount } from '@lifinance/sdk';
import { Box, List, Typography } from '@mui/material';
import { FC, PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { defaultRangeExtractor, Range, useVirtual } from 'react-virtual';
import { useDebouncedWatch, useTokenBalances } from '../../hooks';
import { TokenFilterType } from '../../pages/SelectTokenPage';
import {
  SwapFormKey,
  SwapFormKeyHelper,
} from '../../providers/SwapFormProvider';
import { useWallet } from '../../providers/WalletProvider';
import { TokenListItem, TokenListItemSkeleton } from './TokenListItem';
import { TokenListProps } from './types';
import {
  createTokenAmountSkeletons,
  skeletonKey,
  tokenAmountMock,
} from './utils';

export const TokenList: FC<PropsWithChildren<TokenListProps>> = ({
  children,
  formType,
  headerHeight,
  height,
  onClick,
}) => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { setValue } = useFormContext();
  const [selectedChainId, myTokensFilter] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType), SwapFormKey.MyTokensFilter],
  });
  const [fromSearchTokensFilter, toSearchTokensFilter]: string[] =
    useDebouncedWatch(
      [SwapFormKey.FromSearchTokensFilter, SwapFormKey.ToSearchTokensFilter],
      250,
    );
  const debouncedSearchTokensFilter =
    formType === 'from' ? fromSearchTokensFilter : toSearchTokensFilter;

  const {
    tokens,
    tokensWithBalance,
    isLoading,
    isBalancesLoading,
    isBalancesFetching,
  } = useTokenBalances(selectedChainId);

  const chainTokens = useMemo(() => {
    let chainTokens =
      (myTokensFilter === TokenFilterType.My
        ? tokensWithBalance?.filter((token) => token.amount !== '0')
        : tokens) ?? [];
    const searchFilter = debouncedSearchTokensFilter?.toUpperCase() ?? '';
    const isFilteredChainTokensLoading =
      myTokensFilter === TokenFilterType.My ? isBalancesLoading : isLoading;
    chainTokens = isFilteredChainTokensLoading
      ? // tokenAmountMock is used as a first token to create sticky header for virtual list
        [tokenAmountMock, ...createTokenAmountSkeletons()]
      : [
          tokenAmountMock,
          ...(debouncedSearchTokensFilter
            ? chainTokens.filter(
                (token) =>
                  token.name.toUpperCase().includes(searchFilter) ||
                  token.symbol.toUpperCase().includes(searchFilter) ||
                  token.address.toUpperCase().includes(searchFilter),
              )
            : chainTokens),
        ];
    return chainTokens;
  }, [
    debouncedSearchTokensFilter,
    isBalancesLoading,
    isLoading,
    myTokensFilter,
    tokens,
    tokensWithBalance,
  ]);

  const parentRef = useRef<HTMLUListElement | null>(null);

  const { virtualItems, totalSize } = useVirtual({
    size: chainTokens.length,
    parentRef,
    overscan: 3,
    estimateSize: useCallback(
      (index: number) => (index === 0 ? headerHeight : 60),
      [headerHeight],
    ),
    keyExtractor: (index) => chainTokens[index].address ?? index,
    rangeExtractor: useCallback((range: Range) => {
      if (range.size === 0) {
        return [];
      }
      return Array.from(new Set([0, ...defaultRangeExtractor(range)]));
    }, []),
  });

  const handleTokenClick = useCallback(
    (tokenAddress: string) => {
      setValue(SwapFormKeyHelper.getTokenKey(formType), tokenAddress);
      onClick?.();
    },
    [formType, onClick, setValue],
  );

  return (
    <Box ref={parentRef} style={{ height, overflow: 'auto' }}>
      <List style={{ height: totalSize }} disablePadding>
        {virtualItems.map((item) => {
          if (item.index === 0) {
            return (
              <Box
                key={item.key}
                sx={{
                  backgroundColor: (theme) => theme.palette.common.white,
                  zIndex: 1,
                  position: 'sticky',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${item.size}px`,
                  transform: `translateY(${item.start}px)`,
                }}
              >
                {children}
              </Box>
            );
          }
          const token = chainTokens[item.index] as TokenAmount;
          if (token.name.includes(skeletonKey)) {
            return (
              <TokenListItemSkeleton
                key={item.key}
                size={item.size}
                start={item.start}
              />
            );
          }
          return (
            <TokenListItem
              key={item.key}
              onClick={handleTokenClick}
              size={item.size}
              start={item.start}
              token={token}
              isBalancesLoading={isBalancesLoading}
            />
          );
        })}
      </List>
      {virtualItems.length <= 1 && account.isActive ? (
        <Typography variant="body1" align="center" py={2} px={3}>
          {t('swap.couldntFindTokens')}
        </Typography>
      ) : null}
      {!account.isActive ? (
        <Typography variant="body1" align="center" py={2} px={3}>
          {t('swap.walletNotConnected')}
        </Typography>
      ) : null}
    </Box>
  );
};
