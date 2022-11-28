/* eslint-disable consistent-return */
import {
  Done as DoneIcon,
  ErrorRounded as ErrorIcon,
  InfoRounded as InfoIcon,
  WarningRounded as WarningIcon,
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
import { RouteExecutionStatus } from '../../stores';
import {
  formatTokenAmount,
  hasEnumFlag,
  navigationRoutes,
  shortenWalletAddress,
} from '../../utils';
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

  const toToken = {
    ...(route.steps.at(-1)?.execution?.toToken ?? route.toToken),
    amount:
      route.steps.at(-1)?.execution?.toAmount ??
      route.steps.at(-1)?.estimate.toAmount ??
      route.toAmount,
  };

  const { token, refetch, refetchNewBalance, refetchAllBalances } =
    useTokenBalance(toToken, route.toAddress);

  const clearFromAmount = () => {
    refetchAllBalances();
    setValue(SwapFormKey.FromAmount, '');
  };

  const handleDone = () => {
    clearFromAmount();
    navigateBack();
  };

  const handlePartialDone = () => {
    clearFromAmount();
    if (
      toToken.chainId !== route.toToken.chainId &&
      toToken.address !== route.toToken.address
    ) {
      setValue(
        SwapFormKey.FromAmount,
        formatTokenAmount(toToken.amount, toToken.decimals),
        { shouldTouch: true },
      );
      setValue(SwapFormKey.FromChain, toToken.chainId, { shouldTouch: true });
      setValue(SwapFormKey.FromToken, toToken.address, { shouldTouch: true });
      setValue(SwapFormKey.ToChain, route.toToken.chainId, {
        shouldTouch: true,
      });
      setValue(SwapFormKey.ToToken, route.toToken.address, {
        shouldTouch: true,
      });
    }
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
  let primaryMessage;
  let secondaryMessage;
  let handlePrimaryButton = handleDone;
  switch (status) {
    case RouteExecutionStatus.Done: {
      title = t('swap.success.title.swapSuccessful');
      if (token) {
        primaryMessage = t('swap.success.message.swapSuccessful', {
          amount: token.amount,
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
          walletAddress: shortenWalletAddress(route.toAddress),
        });
      }
      handlePrimaryButton = handleDone;
      break;
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial: {
      title = t('swap.success.title.swapPartiallySuccessful');
      primaryMessage = t('swap.success.message.swapPartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      });
      if (token) {
        secondaryMessage = t('swap.success.message.swapSuccessful', {
          amount: token.amount,
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
          walletAddress: shortenWalletAddress(route.toAddress),
        });
      }
      handlePrimaryButton = handlePartialDone;
      break;
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded: {
      title = t('swap.success.title.refundIssued');
      primaryMessage = t('swap.success.message.swapPartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      });
      if (token) {
        secondaryMessage = t('swap.success.message.swapSuccessful', {
          amount: token.amount,
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
          walletAddress: shortenWalletAddress(route.toAddress),
        });
      }
      break;
    }
    case RouteExecutionStatus.Failed: {
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
      primaryMessage = processMessage.message;
      handlePrimaryButton = handleClose;
      break;
    }
    default:
      break;
  }

  useEffect(() => {
    const hasSuccessFlag = hasEnumFlag(status, RouteExecutionStatus.Done);
    if (
      (hasSuccessFlag || hasEnumFlag(status, RouteExecutionStatus.Failed)) &&
      !ref.current?.isOpen()
    ) {
      if (hasSuccessFlag) {
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
            {status === RouteExecutionStatus.Idle ? (
              <InfoIcon color="primary" />
            ) : null}
            {status === RouteExecutionStatus.Done ? (
              <DoneIcon color="success" />
            ) : null}
            {hasEnumFlag(status, RouteExecutionStatus.Partial) ||
            hasEnumFlag(status, RouteExecutionStatus.Refunded) ? (
              <WarningIcon color="warning" />
            ) : null}
            {hasEnumFlag(status, RouteExecutionStatus.Failed) ? (
              <ErrorIcon color="error" />
            ) : null}
          </IconCircle>
          <Typography py={1} fontSize={18} fontWeight={700}>
            {title}
          </Typography>
          {hasEnumFlag(status, RouteExecutionStatus.Done) ? (
            <Token token={toToken} py={1} disableDescription />
          ) : null}
        </IconContainer>
        <Typography py={1}>{primaryMessage}</Typography>
        {secondaryMessage ? (
          <Typography py={1}>{secondaryMessage}</Typography>
        ) : null}
        <Box mt={2}>
          <Button variant="contained" fullWidth onClick={handlePrimaryButton}>
            {status === RouteExecutionStatus.Idle ? t('button.ok') : null}
            {hasEnumFlag(status, RouteExecutionStatus.Done)
              ? t('button.done')
              : null}
            {status === RouteExecutionStatus.Failed
              ? t('button.seeDetails')
              : null}
          </Button>
        </Box>
        {hasEnumFlag(status, RouteExecutionStatus.Done) ? (
          <Box mt={2}>
            <Button variant="text" onClick={handleSeeDetails} fullWidth>
              {t('button.seeDetails')}
            </Button>
          </Box>
        ) : null}
      </Box>
    </BottomSheet>
  );
};
