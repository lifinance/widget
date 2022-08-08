import { TokenAmount } from '@lifi/sdk';
import { List } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FC, useEffect } from 'react';
import { TokenListItem, TokenListItemSkeleton } from './TokenListItem';
import { VirtualizedTokenListProps } from './types';
import { skeletonKey } from './utils';

export const VirtualizedTokenList: FC<VirtualizedTokenListProps> = ({
  tokens,
  scrollElementRef,
  onClick,
  chainId,
  isBalanceLoading,
  showBalance,
}) => {
  const { getVirtualItems, getTotalSize, scrollToIndex } = useVirtualizer({
    count: tokens.length,
    getScrollElement: () => scrollElementRef.current,
    overscan: 3,
    paddingEnd: 12,
    estimateSize: () => 64,
    getItemKey: (index) => tokens[index].address ?? index,
  });

  useEffect(() => {
    scrollToIndex(0, { align: 'start', smoothScroll: false });
  }, [scrollToIndex, chainId]);

  return (
    <List style={{ height: getTotalSize() }} disablePadding>
      {getVirtualItems().map((item) => {
        const token = tokens[item.index] as TokenAmount;
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
            onClick={onClick}
            size={item.size}
            start={item.start}
            token={token}
            isBalanceLoading={isBalanceLoading}
            showBalance={showBalance}
          />
        );
      })}
    </List>
  );
};
