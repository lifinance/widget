import {
  ContentCopy as ContentCopyIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
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
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { Card, CardTitle } from '../../components/Card';
import { Dialog } from '../../components/Dialog';
import { useSetHeaderAction } from '../../components/Header';
import { Step } from '../../components/Step';
import { StepDivider } from '../../components/StepDivider';
import { useNavigateBack } from '../../hooks';
import { useRouteStore } from '../../stores';
import { Container } from './SwapDetailsPage.style';

export const SwapDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const setHeaderAction = useSetHeaderAction();
  const { state }: any = useLocation();
  const [routeExecution, deleteRoute] = useRouteStore(
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

  const copyRouteId = async () => {
    await navigator.clipboard.writeText(routeExecution?.route.id ?? '');
  };

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
          {new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(
            startedAt,
          )}
        </Typography>
        <Typography fontSize={12}>
          {new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(
            startedAt,
          )}
        </Typography>
      </Box>
      {routeExecution?.route.steps.map((step, index, steps) => (
        <Fragment key={step.id}>
          <Step
            step={step}
            fromToken={
              index === 0
                ? { ...step.action.fromToken, amount: step.action.fromAmount }
                : undefined
            }
            toToken={
              index === steps.length - 1
                ? {
                    ...step.action.toToken,
                    amount: step.execution?.toAmount ?? step.estimate.toAmount,
                  }
                : undefined
            }
          />
          {steps.length > 1 && index !== steps.length - 1 ? (
            <StepDivider />
          ) : null}
        </Fragment>
      ))}
      <Card mt={2}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
          }}
        >
          <CardTitle flex={1}>{t('swap.routeId')}</CardTitle>
          <Box mr={1} mt={1}>
            <IconButton
              size="medium"
              aria-label="settings"
              onClick={copyRouteId}
            >
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
          {routeExecution?.route.id}
        </Typography>
      </Card>
      <Box mt={2}>
        <Button
          variant="contained"
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
            {t('swap.warning.message.deleteSwap')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
          <Button onClick={handleDeleteRoute} autoFocus>
            {t('button.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
