import {
  Done as DoneIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { Token } from '../../components/Token';
import { useChains, useNavigateBack, useTokenBalance } from '../../hooks';
import { SwapFormKey } from '../../providers';
import type { RouteExecution } from '../../stores';
import {
  IconCircle,
  IconContainer,
  iconStyles,
} from './StatusBottomSheet.style';
import { getProcessMessage } from './utils';

export const StatusBottomSheet: React.FC<RouteExecution> = ({
  status,
  route,
}) => {
  const { t } = useTranslation();
  const { navigateBack } = useNavigateBack();
  const ref = useRef<BottomSheetBase>(null);
  const { getChainById } = useChains();
  const { token, refetch: refetchBalance } = useTokenBalance(
    route.toChainId,
    route.toToken.address,
  );
  const { setValue } = useFormContext();

  const clearFromAmount = () => {
    refetchBalance();
    setValue(SwapFormKey.FromAmount, '');
  };

  const handleDone = () => {
    clearFromAmount();
    navigateBack();
  };

  const handleClose = () => {
    clearFromAmount();
    ref.current?.closeDrawer();
  };

  const { title, message } = useMemo(() => {
    switch (status) {
      case 'success':
        return {
          title: t('swap.success.title.fundsReceived'),
          message: t('swap.success.message.fundsReceived', {
            amount: token?.amount,
            tokenSymbol: token?.symbol,
            chainName: getChainById(route.toChainId)?.name,
          }),
        };
      case 'error': {
        const step = route.steps.find((step) =>
          step.execution?.process.some(
            (process) => process.status === 'FAILED',
          ),
        );
        const process = step?.execution?.process.find(
          (process) => process.status === 'FAILED',
        );
        if (!step || !process) {
          return {};
        }
        return getProcessMessage(t, getChainById, step, process);
      }
      default:
        return {};
    }
  }, [
    getChainById,
    route.steps,
    route.toChainId,
    status,
    t,
    token?.amount,
    token?.symbol,
  ]);

  useEffect(() => {
    if (
      (status === 'success' || status === 'error') &&
      !ref.current?.isOpen()
    ) {
      refetchBalance();
      ref.current?.openDrawer();
    }
  }, [refetchBalance, status]);
  return (
    <BottomSheet ref={ref}>
      <Box p={3}>
        <IconContainer>
          <IconCircle status={status} mb={1}>
            {status === 'idle' ? (
              <InfoIcon color="primary" sx={iconStyles} />
            ) : null}
            {status === 'success' ? (
              <DoneIcon color="success" sx={iconStyles} />
            ) : null}
            {status === 'error' ? (
              <WarningIcon color="error" sx={iconStyles} />
            ) : null}
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
            />
          ) : null}
        </IconContainer>
        <Typography pt={2} pb={1}>
          {message}
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={status === 'success' ? handleDone : handleClose}
          >
            {status === 'idle' ? t('button.okay') : null}
            {status === 'success' ? t('button.done') : null}
            {status === 'error' ? t('button.tryAgain') : null}
          </Button>
        </Box>
        {status === 'success' ? (
          <Box mt={2}>
            <Button variant="outlined" fullWidth onClick={handleClose}>
              {t('button.seeDetails')}
            </Button>
          </Box>
        ) : null}
      </Box>
    </BottomSheet>
  );
};
