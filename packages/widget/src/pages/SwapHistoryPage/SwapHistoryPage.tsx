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
import { useSetHeaderAction } from '../../components/Header';
import { useWallet } from '../../providers/WalletProvider';
import { useRouteStore } from '../../stores';
import { useSwapHistory } from '../../stores/route';
import { SwapHistoryEmpty } from './SwapHistoryEmpty';
import { SwapHistoryItem } from './SwapHistoryItem';

export const SwapHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const swaps = useSwapHistory(account.address);
  const deleteRoutes = useRouteStore((store) => store.deleteRoutes);
  const setHeaderAction = useSetHeaderAction();
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  useEffect(() => {
    return setHeaderAction(
      <IconButton
        size="medium"
        aria-label="settings"
        edge="end"
        onClick={toggleDialog}
      >
        <DeleteIcon />
      </IconButton>,
    );
  }, [setHeaderAction, toggleDialog]);

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
            {t('swap.warning.message.deleteSwap')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button onClick={deleteRoutes} autoFocus>
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
