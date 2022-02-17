import { useDebouncedWatch } from '@lifinance/widget/hooks/useDebouncedWatch';
import { Box, List, Typography } from '@mui/material';
import { useCallback, useMemo, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { defaultRangeExtractor, useVirtual } from 'react-virtual';
import { usePriorityAccount } from '../../hooks/connectorHooks';
import { useTokens } from '../../hooks/useToken';
import {
  SwapFormKey,
  SwapFormKeyHelper,
} from '../../providers/SwapFormProvider';
import { TokenFilterType } from '../SelectTokenDrawer';
import {
  MemoizedTokenListItem,
  MemoizedTokenListItemSkeleton,
} from './TokenListItem';
import { TokenListProps } from './types';
import {
  createTokenAmountSkeletons,
  skeletonKey,
  tokenAmountMock,
} from './utils';

export const TokenList: React.FC<TokenListProps> = ({
  children,
  formType,
  headerHeight,
  height,
  onClick,
}) => {
  const { t } = useTranslation();
  const account = usePriorityAccount();
  const { setValue } = useFormContext();
  const [selectedChain, myTokensFilter] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType), SwapFormKey.MyTokensFilter],
  });
  const [fromSearchTokensFilter, toSearchTokensFilter]: string[] =
    useDebouncedWatch(
      [SwapFormKey.FromSearchTokensFilter, SwapFormKey.ToSearchTokensFilter],
      250,
    );
  const debouncedSearchTokensFilter =
    formType === 'from' ? fromSearchTokensFilter : toSearchTokensFilter;

  const { tokens, tokensWithBalance, isLoading, isBalancesLoading } =
    useTokens(selectedChain);

  const filteredChainTokens =
    myTokensFilter === TokenFilterType.My ? tokensWithBalance : tokens;
  const isFilteredChainTokensLoading =
    myTokensFilter === TokenFilterType.My ? isBalancesLoading : isLoading;

  const chainTokens = useMemo(() => {
    let chainTokens = filteredChainTokens?.[selectedChain] ?? [];
    const searchFilter = debouncedSearchTokensFilter?.toUpperCase() ?? '';
    chainTokens = isFilteredChainTokensLoading
      ? [tokenAmountMock, ...createTokenAmountSkeletons()]
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
    filteredChainTokens,
    isFilteredChainTokensLoading,
    selectedChain,
  ]);

  const parentRef = useRef<HTMLUListElement | null>(null);

  const { virtualItems, totalSize } = useVirtual({
    size: chainTokens.length,
    parentRef,
    overscan: 5,
    estimateSize: useCallback(
      (index) => (index === 0 ? headerHeight : 60),
      [headerHeight],
    ),
    keyExtractor: (index) => chainTokens[index].address ?? index,
    rangeExtractor: useCallback((range) => {
      if (range.size === 0) {
        return [];
      }
      return Array.from(new Set([0, ...defaultRangeExtractor(range)]));
    }, []),
  });

  const handleTokenClick = useCallback(
    (token: string) => {
      setValue(SwapFormKeyHelper.getTokenKey(formType), token);
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
          const token = chainTokens[item.index];
          if (token.name.includes(skeletonKey)) {
            return (
              <MemoizedTokenListItemSkeleton
                key={item.key}
                size={item.size}
                start={item.start}
              />
            );
          }
          return (
            <MemoizedTokenListItem
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
      {virtualItems.length <= 1 && account ? (
        <Typography variant="body1" align="center" py={2} px={3}>
          {t('swap.couldntFindTokens')}
        </Typography>
      ) : null}
      {!account ? (
        <Typography variant="body1" align="center" py={2} px={3}>
          {t('swap.walletNotConnected')}
        </Typography>
      ) : null}
    </Box>
  );
};
