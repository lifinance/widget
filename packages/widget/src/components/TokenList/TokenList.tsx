import { TokenAmount } from '@lifinance/sdk';
import { Box, List, Typography } from '@mui/material';
import { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useVirtual } from 'react-virtual';
import { useDebouncedWatch, useTokenBalances } from '../../hooks';
import {
  SwapFormKey,
  SwapFormKeyHelper,
} from '../../providers/SwapFormProvider';
import { useWallet } from '../../providers/WalletProvider';
import { TokenListItem, TokenListItemSkeleton } from './TokenListItem';
import { TokenListProps } from './types';
import { createTokenAmountSkeletons, skeletonKey } from './utils';

export const TokenList: FC<TokenListProps> = ({
  formType,
  height,
  onClick,
}) => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { setValue, getValues } = useFormContext();
  const [selectedChainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType)],
  });
  const [searchTokensFilter]: string[] = useDebouncedWatch(
    [SwapFormKey.SearchTokensFilter],
    250,
  );

  const { tokens, isLoading } = useTokenBalances(selectedChainId);

  const chainTokens = useMemo(() => {
    let chainTokens = tokens ?? [];
    const searchFilter = searchTokensFilter?.toUpperCase() ?? '';
    chainTokens = isLoading
      ? createTokenAmountSkeletons()
      : searchTokensFilter
      ? chainTokens.filter(
          (token) =>
            token.name.toUpperCase().includes(searchFilter) ||
            token.symbol.toUpperCase().includes(searchFilter) ||
            token.address.toUpperCase().includes(searchFilter),
        )
      : chainTokens;
    return chainTokens;
  }, [isLoading, searchTokensFilter, tokens]);

  const parentRef = useRef<HTMLUListElement | null>(null);

  const { virtualItems, totalSize, scrollToIndex } = useVirtual({
    size: chainTokens.length,
    parentRef,
    overscan: 3,
    paddingEnd: 12,
    estimateSize: useCallback(() => 64, []),
    keyExtractor: (index) => chainTokens[index].address ?? index,
  });

  useEffect(() => {
    scrollToIndex(0);
  }, [scrollToIndex, selectedChainId]);

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
      {!virtualItems.length ? (
        <Typography variant="body1" align="center" py={2} px={3}>
          {t('swap.couldntFindTokens')}
        </Typography>
      ) : null}
      <List style={{ height: totalSize }} disablePadding>
        {virtualItems.map((item) => {
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
              showBalance={account.isActive}
            />
          );
        })}
      </List>
    </Box>
  );
};
