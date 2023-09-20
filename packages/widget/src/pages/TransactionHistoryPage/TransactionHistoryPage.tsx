import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../components/Dialog';
import { useWallet } from '../../providers';
import { useHeaderStoreContext, useRouteExecutionStore } from '../../stores';
// import { useTransactionHistory } from '../../stores/routes';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty';
import { TransactionHistoryItem } from './TransactionHistoryItem';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';

export const TransactionHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { data: transactions } = useTransactionHistory(account.address);

  const headerStoreContext = useHeaderStoreContext();

  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

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

  // until virtualisation is done
  const latest5Tx = transactions.slice(
    transactions.length - 5,
    transactions.length,
  );

  return (
    <Container>
      <Stack spacing={2} mt={1}>
        {transactions.length ? (
          latest5Tx.map((transaction, index) => (
            <TransactionHistoryItem key={index} transaction={transaction} />
          ))
        ) : (
          <TransactionHistoryEmpty />
        )}
      </Stack>
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
