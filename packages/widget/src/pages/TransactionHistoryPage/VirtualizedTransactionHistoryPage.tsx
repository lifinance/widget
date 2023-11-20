import type { FullStatusData, StatusResponse } from '@lifi/sdk';
import { List } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { FC, MutableRefObject } from 'react';
import { useEffect } from 'react';
import { TransactionHistoryItem } from './TransactionHistoryItem';
import { TransactionHistorySkeleton } from './TransactionHistorySkeleton';

interface VirtualizedTransactionHistoryProps {
  transactions: StatusResponse[];
  scrollElementRef: MutableRefObject<HTMLElement | null>;
  isLoading: boolean;
}

export const VirtualizedTransactionHistory: FC<
  VirtualizedTransactionHistoryProps
> = ({ transactions, scrollElementRef, isLoading }) => {
  const { getVirtualItems, getTotalSize, scrollToIndex } = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => scrollElementRef.current,
    overscan: 5,
    estimateSize: () => 192,
    getItemKey: (index) =>
      `${(transactions[index] as FullStatusData).transactionId}-${index}`,
    paddingEnd: 12,
  });

  useEffect(() => {
    if (getVirtualItems().length) {
      scrollToIndex(0, { align: 'start' });
    }
  }, [scrollToIndex, getVirtualItems]);

  if (isLoading) {
    return (
      <List disablePadding>
        {Array.from({ length: 3 }).map((_, index) => (
          <TransactionHistorySkeleton key={index} />
        ))}
      </List>
    );
  }

  return (
    <List style={{ height: getTotalSize() }} disablePadding>
      {getVirtualItems().map((item) => {
        const transaction = transactions[item.index];
        return (
          <TransactionHistoryItem
            key={item.key}
            size={item.size}
            start={item.start}
            transaction={transaction}
          />
        );
      })}
    </List>
  );
};
