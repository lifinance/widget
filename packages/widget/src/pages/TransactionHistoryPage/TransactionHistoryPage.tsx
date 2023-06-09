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
import { useHeaderStore } from '../../components/Header';
import { useWallet } from '../../providers';
import { useRouteExecutionStore } from '../../stores';
import { useTransactionHistory } from '../../stores/routes';
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty';
import { TransactionHistoryItem } from './TransactionHistoryItem';

export const TransactionHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const transactions = useTransactionHistory(account.address);
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (transactions.length) {
      return useHeaderStore.getState().setAction(
        <IconButton size="medium" edge="end" onClick={toggleDialog}>
          <DeleteIcon />
        </IconButton>,
      );
    }
  }, [transactions.length, toggleDialog]);

  if (!transactions.length) {
    return <TransactionHistoryEmpty />;
  }

  return (
    <Container>
      <Stack spacing={2} mt={1}>
        {transactions.length ? (
          transactions.map(({ route }) => (
            <TransactionHistoryItem key={route.id} route={route} />
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
