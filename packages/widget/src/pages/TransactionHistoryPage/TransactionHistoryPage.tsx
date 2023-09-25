import { Box, Container, Stack } from '@mui/material';
import { useLayoutEffect, useRef, useState } from 'react';
import { useWallet } from '../../providers';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import { VirtualizedTransactionHistory } from './VirtualizedTransactionHistoryPage';
import { useContentHeight } from '../../hooks';

const minTransactionListHeight = 680;

export const TransactionHistoryPage: React.FC = () => {
  const parentRef = useRef<HTMLUListElement | null>(null);
  const [tokenListHeight, setTokenListHeight] = useState(0);
  const contentHeight = useContentHeight();
  const { account } = useWallet();
  const { data: transactions, isLoading } = useTransactionHistory(
    account.address,
  );

  useLayoutEffect(() => {
    setTokenListHeight(Math.max(contentHeight, minTransactionListHeight));
  }, [contentHeight]);

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
        style={{ height: tokenListHeight, overflow: 'auto' }}
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
