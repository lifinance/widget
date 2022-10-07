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
  Stack,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../components/Dialog';
import { useHeaderActionStore } from '../../components/Header';
import { useWallet } from '../../providers';
import { useRouteExecutionStore } from '../../stores';
import { useSwapHistory } from '../../stores/routes';
import { SwapHistoryEmpty } from './SwapHistoryEmpty';
import { SwapHistoryItem } from './SwapHistoryItem';

export const SwapHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const swaps = useSwapHistory(account.address);
  const deleteRoutes = useRouteExecutionStore((store) => store.deleteRoutes);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    if (swaps.length) {
      return useHeaderActionStore.getState().setAction(
        <IconButton size="medium" edge="end" onClick={toggleDialog}>
          <DeleteIcon />
        </IconButton>,
      );
    }
  }, [swaps.length, toggleDialog]);

  if (!swaps.length) {
    return <SwapHistoryEmpty />;
  }

  return (
    <Container>
      <Stack spacing={2} mt={1}>
        {swaps.length ? (
          swaps.map(({ route }) => (
            <SwapHistoryItem key={route.id} route={route} />
          ))
        ) : (
          <SwapHistoryEmpty />
        )}
      </Stack>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>{t('swap.warning.title.deleteSwapHistory')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('swap.warning.message.deleteSwapHistory')}
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
