import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { Card, CardTitle } from '../../components/Card';
import { ContractComponent } from '../../components/ContractComponent';
import { Dialog } from '../../components/Dialog';
import { useHeaderActionStore } from '../../components/Header';
import { Insurance } from '../../components/Insurance';
import { getStepList } from '../../components/Step';
import { useNavigateBack } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import { useRouteExecutionStore } from '../../stores';
import { Container } from './SwapDetailsPage.style';

export const SwapDetailsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const { variant } = useWidgetConfig();
  const { state }: any = useLocation();
  const [routeExecution, deleteRoute] = useRouteExecutionStore(
    (store) => [store.routes[state?.routeId], store.deleteRoute],
    shallow,
  );
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const handleDeleteRoute = () => {
    navigateBack();
    if (routeExecution) {
      deleteRoute(routeExecution.route.id);
    }
  };

  const sourceTxHash = routeExecution?.route.steps[0].execution?.process
    .filter((process) => process.type !== 'TOKEN_ALLOWANCE')
    .find((process) => process.txHash)?.txHash;

  const insuranceCoverageId = sourceTxHash ?? routeExecution?.route.fromAddress;

  let supportId = sourceTxHash ?? routeExecution?.route.id ?? '';

  if (process.env.NODE_ENV === 'development') {
    supportId += `_${routeExecution?.route.id}`;
  }

  const copySupportId = async () => {
    await navigator.clipboard.writeText(supportId);
  };

  useEffect(() => {
    return useHeaderActionStore.getState().setAction(
      <IconButton size="medium" edge="end" onClick={toggleDialog}>
        <DeleteIcon />
      </IconButton>,
    );
  }, [toggleDialog]);

  const startedAt = new Date(
    routeExecution?.route.steps[0].execution?.process[0].startedAt ?? 0,
  );

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
        pb={1}
      >
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(
            startedAt,
          )}
        </Typography>
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(i18n.language, {
            timeStyle: 'short',
          }).format(startedAt)}
        </Typography>
      </Box>
      {getStepList(routeExecution?.route)}
      {variant === 'nft' ? <ContractComponent mt={2} /> : null}
      {routeExecution?.route?.insurance?.state === 'INSURED' ? (
        <Insurance
          mt={2}
          status={routeExecution.status}
          feeAmountUsd={routeExecution.route.insurance.feeAmountUsd}
          insurableRouteId={routeExecution.route.id}
          insuranceCoverageId={insuranceCoverageId}
        />
      ) : null}
      <Card mt={2}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
          }}
        >
          <CardTitle flex={1}>{t('swap.supportId')}</CardTitle>
          <Box mr={1} mt={1}>
            <IconButton size="medium" onClick={copySupportId}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Typography
          variant="body2"
          pt={1}
          pb={2}
          px={2}
          sx={{ wordBreak: 'break-all' }}
        >
          {supportId}
        </Typography>
      </Card>
      <Box mt={2}>
        <Button
          href="https://discord.com/channels/849912621360218112/863689862514343946"
          target="_blank"
          rel="nofollow noreferrer"
          fullWidth
        >
          {t('button.contactSupport')}
        </Button>
      </Box>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>{t('swap.warning.title.deleteSwap')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('swap.warning.message.deleteSwapHistory')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button variant="contained" onClick={handleDeleteRoute} autoFocus>
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
