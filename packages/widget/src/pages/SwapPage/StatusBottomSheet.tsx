/* eslint-disable consistent-return */
import {
  Done as DoneIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { Token } from '../../components/Token';
import {
  getProcessMessage,
  useChains,
  useNavigateBack,
  useTokenBalance,
} from '../../hooks';
import { SwapFormKey } from '../../providers';
import type { RouteExecution } from '../../stores';
import { navigationRoutes, shortenWalletAddress } from '../../utils';
import { IconCircle, IconContainer } from './StatusBottomSheet.style';

export const StatusBottomSheet: React.FC<RouteExecution> = ({
  status,
  route,
}) => {
  const { t } = useTranslation();
  const { navigateBack, navigate } = useNavigateBack();
  const ref = useRef<BottomSheetBase>(null);
  const { getChainById } = useChains();
  const { setValue } = useFormContext();
  const { token, refetch, refetchNewBalance, refetchAllBalances } =
    useTokenBalance(route.toToken, route.toAddress);

  const clearFromAmount = () => {
    refetchAllBalances();
    setValue(SwapFormKey.FromAmount, '');
  };

  const handleDone = () => {
    clearFromAmount();
    navigateBack();
  };

  const handleClose = () => {
    clearFromAmount();
    ref.current?.close();
  };

  const handleSeeDetails = () => {
    handleClose();
    navigate(navigationRoutes.swapDetails, {
      state: { routeId: route.id },
      replace: true,
    });
  };

  let title;
  let message;
  switch (status) {
    case 'success':
      title = t('swap.success.title.swapSuccessful');
      message = t('swap.success.message.swapSuccessful', {
        amount: token?.amount,
        tokenSymbol: token?.symbol,
        chainName: getChainById(route.toChainId)?.name,
        walletAddress: shortenWalletAddress(route.toAddress),
      });
      break;
    case 'error': {
      const step = route.steps.find(
        (step) => step.execution?.status === 'FAILED',
      );
      const process = step?.execution?.process.find(
        (process) => process.status === 'FAILED',
      );
      if (!step || !process) {
        break;
      }
      const processMessage = getProcessMessage(t, getChainById, step, process);
      title = processMessage.title;
      message = processMessage.message;
      break;
    }
    default:
      break;
  }

  useEffect(() => {
    if (
      (status === 'success' || status === 'error') &&
      !ref.current?.isOpen()
    ) {
      if (status === 'success') {
        refetchNewBalance();
        refetch();
      }
      ref.current?.open();
    }
  }, [refetch, refetchNewBalance, status]);

  return (
    <BottomSheet ref={ref}>
      <Box p={3}>
        <IconContainer>
          <IconCircle status={status} mb={1}>
            {status === 'idle' ? <InfoIcon color="primary" /> : null}
            {status === 'success' ? <DoneIcon color="success" /> : null}
            {status === 'error' ? <WarningIcon color="error" /> : null}
          </IconCircle>
          <Typography py={1} fontSize={18} fontWeight={700}>
            {title}
          </Typography>
          {status === 'success' ? (
            <Token
              token={{
                ...route.toToken,
                amount:
                  route.steps.at(-1)?.execution?.toAmount ??
                  route.steps.at(-1)?.estimate.toAmount ??
                  route.toAmount,
              }}
              py={1}
              disableDescription
            />
          ) : null}
        </IconContainer>
        <Typography py={1}>{message}</Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={status === 'success' ? handleDone : handleClose}
          >
            {status === 'idle' ? t('button.ok') : null}
            {status === 'success' ? t('button.done') : null}
            {status === 'error' ? t('button.seeDetails') : null}
          </Button>
        </Box>
        {status === 'success' ? (
          <Box mt={2}>
            <Button variant="text" fullWidth onClick={handleSeeDetails}>
              {t('button.seeDetails')}
            </Button>
          </Box>
        ) : null}
      </Box>
    </BottomSheet>
  );
};
