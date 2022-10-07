/* eslint-disable consistent-return */
import { DeleteOutline as DeleteIcon } from '@mui/icons-material';
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
import { ActiveSwapItem } from '../../components/ActiveSwaps';
import { Dialog } from '../../components/Dialog';
import { useHeaderActionStore } from '../../components/Header';
import { useWallet } from '../../providers';
import { useExecutingRoutesIds, useRouteExecutionStore } from '../../stores';
import { ActiveSwapsEmpty } from './ActiveSwapsEmpty';

export const ActiveSwapsPage = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const executingRoutes = useExecutingRoutesIds(account.address);
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (executingRoutes.length) {
      return useHeaderActionStore.getState().setAction(
        <IconButton size="medium" edge="end" onClick={toggleDialog}>
          <DeleteIcon />
        </IconButton>,
      );
    }
  }, [executingRoutes.length, toggleDialog]);

  if (!executingRoutes.length) {
    return <ActiveSwapsEmpty />;
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
          <ActiveSwapItem key={routeId} routeId={routeId} />
        ))}
      </List>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>{t('swap.warning.title.deleteActiveSwaps')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('swap.warning.message.deleteActiveSwaps')}
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
