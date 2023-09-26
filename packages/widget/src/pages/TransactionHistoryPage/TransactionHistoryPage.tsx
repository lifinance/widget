import { Box, Container, Stack } from '@mui/material';
import { useRef } from 'react';
import { useWallet } from '../../providers';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import { VirtualizedTransactionHistory } from './VirtualizedTransactionHistoryPage';
import { ExtendedTransactionInfo } from '@lifi/sdk';

const minTransactionListHeight = 680;

export const TransactionHistoryPage: React.FC = () => {
  const parentRef = useRef<HTMLUListElement | null>(null);
  const { account } = useWallet();
  const { data: transactions, isLoading } = useTransactionHistory();

  if (!transactions.length && !isLoading) {
    return <TransactionHistoryEmpty />;
  }

  const sortedTransactions = transactions.sort((a, b) => {
    return (
      ((b.sending as ExtendedTransactionInfo)?.timestamp ?? 0) -
      ((a.sending as ExtendedTransactionInfo)?.timestamp ?? 0)
    );
  });

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
            transactions={sortedTransactions}
            isLoading={isLoading}
            scrollElementRef={parentRef}
          />
        </Stack>
      </Box>
    </Container>
  );
};
