import type { FullStatusData } from '@lifi/sdk';
import { List } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { PageContainer } from '../../components/PageContainer.js';
import { useTransactionHistory } from '../../hooks/useTransactionHistory.js';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js';
import { TransactionHistoryItem } from './TransactionHistoryItem.js';
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js';
import { minTransactionListHeight } from './constants.js';

export const TransactionHistoryPage: React.FC = () => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null);
  const { data: transactions, isLoading } = useTransactionHistory();

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: transactions.length,
    overscan: 10,
    paddingStart: 8,
    paddingEnd: 12,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 186,
    getItemKey: (index) =>
      `${(transactions[index] as FullStatusData).transactionId}-${index}`,
  });

  if (!transactions.length && !isLoading) {
    return <TransactionHistoryEmpty />;
  }

  return (
    <PageContainer
      ref={parentRef}
      style={{ height: minTransactionListHeight, overflow: 'auto' }}
    >
      <List
        style={{ height: getTotalSize(), width: '100%', position: 'relative' }}
        disablePadding
      >
        {isLoading ? (
          <List sx={{ paddingTop: 1, paddingBottom: 1 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TransactionHistoryItemSkeleton key={index} />
            ))}
          </List>
        ) : (
          getVirtualItems().map((item) => {
            const transaction = transactions[item.index];
            return (
              <TransactionHistoryItem
                key={item.key}
                size={item.size}
                start={item.start}
                transaction={transaction}
              />
            );
          })
        )}
      </List>
    </PageContainer>
  );
};
