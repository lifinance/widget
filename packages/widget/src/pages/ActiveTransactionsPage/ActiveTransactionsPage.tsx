import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {
  Button,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActiveTransactionItem } from '../../components/ActiveTransactions';
import { Dialog } from '../../components/Dialog';
import { useWallet } from '../../providers';
import {
  useExecutingRoutesIds,
  useHeaderStoreContext,
  useRouteExecutionStore,
} from '../../stores';
import { ActiveTransactionsEmpty } from './ActiveTransactionsEmpty';

export const ActiveTransactionsPage = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const executingRoutes = useExecutingRoutesIds(account.address);
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);
  const headerStoreContext = useHeaderStoreContext();
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (executingRoutes.length) {
      return headerStoreContext.getState().setAction(
        <IconButton size="medium" edge="end" onClick={toggleDialog}>
          <DeleteIcon />
        </IconButton>,
      );
    }
  }, [executingRoutes.length, headerStoreContext, toggleDialog]);

  if (!executingRoutes.length) {
    return <ActiveTransactionsEmpty />;
  }

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {executingRoutes.map((routeId) => (
          <ActiveTransactionItem key={routeId} routeId={routeId} />
        ))}
      </List>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>{t('warning.title.deleteActiveTransactions')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('warning.message.deleteActiveTransactions')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => deleteRoutes('active')}
            autoFocus
          >
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
