import {
  Done as DoneIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BottomSheet, BottomSheetBase } from '../../components/BottomSheet';
import { StepToken } from '../../components/StepToken';
import { RouteExecution, useChains, useTokenBalance } from '../../hooks';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import {
  IconCircle,
  IconContainer,
  iconStyles,
} from './StatusBottomSheet.style';
import { Button } from './SwapPage.style';
import { getProcessMessage } from './utils';

export const StatusBottomSheet: React.FC<RouteExecution> = ({
  status,
  route,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const ref = useRef<BottomSheetBase>(null);
  const { getChainById } = useChains();
  const { token, refetchBalance } = useTokenBalance(
    route.toChainId,
    route.toToken.address,
  );
  const { setValue } = useFormContext();

  const clearFromAmount = () => {
    refetchBalance(route.fromChainId, route.fromToken.address);
    setValue(SwapFormKey.FromAmount, '');
  };

  const handleDone = () => {
    clearFromAmount();
    navigate(-1);
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
            <StepToken
              token={{ ...route.toToken, amount: route.toAmount }}
              py={1}
            />
          ) : null}
        </IconContainer>
        <Typography pt={2} pb={1}>
          {message}
        </Typography>
        <Button
          variant="contained"
          disableElevation
          fullWidth
          onClick={status === 'success' ? handleDone : handleClose}
        >
          {status === 'idle' ? t('button.okay') : null}
          {status === 'success' ? t('button.done') : null}
          {status === 'error' ? t('button.tryAgain') : null}
        </Button>
        {status === 'success' ? (
          <Button
            variant="outlined"
            disableElevation
            fullWidth
            onClick={handleClose}
          >
            {t('button.seeDetails')}
          </Button>
        ) : null}
      </Box>
    </BottomSheet>
  );
};
