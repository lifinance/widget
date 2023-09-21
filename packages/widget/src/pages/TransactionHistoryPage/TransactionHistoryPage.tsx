import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../components/Dialog';
import { useWallet } from '../../providers';
import { useHeaderStoreContext, useRouteExecutionStore } from '../../stores';
// import { useTransactionHistory } from '../../stores/routes';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import { VirtualizedTransactionHistory } from './VirtualizedTransactionHistoryPage';
import { useContentHeight } from '../../hooks';

const minTokenListHeight = 360;

export const TransactionHistoryPage: React.FC = () => {
  const parentRef = useRef<HTMLUListElement | null>(null);
  const [tokenListHeight, setTokenListHeight] = useState(0);
  const contentHeight = useContentHeight();
  const { t } = useTranslation();
  const { account } = useWallet();
  const { data: transactions, isLoading } = useTransactionHistory(
    account.address,
  );

  const headerStoreContext = useHeaderStoreContext();

  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useLayoutEffect(() => {
    setTokenListHeight(Math.max(contentHeight, minTokenListHeight));
  }, [contentHeight]);

  useEffect(() => {
    if (transactions.length) {
      return headerStoreContext.getState().setAction(
        <IconButton size="medium" edge="end" onClick={toggleDialog}>
          <DeleteIcon />
        </IconButton>,
      );
    }
  }, [transactions.length, toggleDialog, headerStoreContext]);

  if (!transactions.length) {
    return <TransactionHistoryEmpty />;
  }

  return (
    <Container>
      <Box
        ref={parentRef}
        style={{ height: tokenListHeight, overflow: 'auto' }}
      >
        <Stack spacing={2} mt={1}>
          {transactions.length ? (
            <VirtualizedTransactionHistory
              transactions={transactions.reverse()}
              isLoading={isLoading}
              scrollElementRef={parentRef}
            />
          ) : (
            <TransactionHistoryEmpty />
          )}
        </Stack>
      </Box>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>{t('warning.title.deleteTransactionHistory')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('warning.message.deleteTransactionHistory')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => deleteRoutes('completed')}
            autoFocus
          >
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
