import { DeleteOutline } from '@mui/icons-material';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActiveTransactionItem } from '../../components/ActiveTransactions/ActiveTransactionItem.js';
import { Dialog } from '../../components/Dialog.js';
import { PageContainer } from '../../components/PageContainer.js';
import { useHeaderStoreContext } from '../../stores/header/useHeaderStore.js';
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js';
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js';
import { ActiveTransactionsEmpty } from './ActiveTransactionsEmpty.js';

export const ActiveTransactionsPage = () => {
  const { t } = useTranslation();
  const executingRoutes = useExecutingRoutesIds();
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
          <DeleteOutline />
        </IconButton>,
      );
    }
  }, [executingRoutes.length, headerStoreContext, toggleDialog]);

  if (!executingRoutes.length) {
    return <ActiveTransactionsEmpty />;
  }

  return (
    <PageContainer disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
          paddingBottom: 1.5,
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
    </PageContainer>
  );
};
