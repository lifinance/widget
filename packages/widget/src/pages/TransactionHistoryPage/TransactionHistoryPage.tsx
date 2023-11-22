import { Box, Container, Stack } from '@mui/material';
import { useRef } from 'react';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty';
import { VirtualizedTransactionHistory } from './VirtualizedTransactionHistoryPage';

const minTransactionListHeight = 544;

export const TransactionHistoryPage: React.FC = () => {
  const parentRef = useRef<HTMLUListElement | null>(null);
  const { data: transactions, isLoading } = useTransactionHistory();

  if (!transactions.length && !isLoading) {
    return <TransactionHistoryEmpty />;
  }

  return (
    <Container
      style={{
        paddingRight: 0,
      }}
    >
      <Box
        ref={parentRef}
        style={{ height: minTransactionListHeight, overflow: 'auto' }}
      >
        <Stack spacing={2} mt={1}>
          <VirtualizedTransactionHistory
            transactions={transactions}
            isLoading={isLoading}
            scrollElementRef={parentRef}
          />
        </Stack>
      </Box>
    </Container>
  );
};
