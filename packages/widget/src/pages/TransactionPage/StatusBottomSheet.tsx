import DoneIcon from '@mui/icons-material/Done';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
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
import { FormKey, useWidgetConfig } from '../../providers';
import type { RouteExecution } from '../../stores';
import { RouteExecutionStatus } from '../../stores';
import {
  formatTokenAmount,
  hasEnumFlag,
  navigationRoutes,
  shortenAddress,
} from '../../utils';
import { CenterContainer, IconCircle } from './StatusBottomSheet.style';

export const StatusBottomSheet: React.FC<RouteExecution> = ({
  status,
  route,
}) => {
  const { t } = useTranslation();
  const { navigateBack, navigate } = useNavigateBack();
  const ref = useRef<BottomSheetBase>(null);
  const { getChainById } = useChains();
  const { setValue } = useFormContext();
  const {
    subvariant,
    contractComponent,
    contractSecondaryComponent,
    contractCompactComponent,
  } = useWidgetConfig();

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
    setValue(FormKey.FromAmount, '');
    setValue(FormKey.ToAmount, '');
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
        FormKey.FromAmount,
        formatTokenAmount(toToken.amount, toToken.decimals),
        { shouldTouch: true },
      );
      setValue(FormKey.FromChain, toToken.chainId, { shouldTouch: true });
      setValue(FormKey.FromToken, toToken.address, { shouldTouch: true });
      setValue(FormKey.ToChain, route.toToken.chainId, {
        shouldTouch: true,
      });
      setValue(FormKey.ToToken, route.toToken.address, {
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
    navigate(navigationRoutes.transactionDetails, {
      state: { routeId: route.id },
      replace: true,
    });
  };

  const transactionType =
    route.fromChainId === route.toChainId ? 'swap' : 'bridge';

  let title;
  let primaryMessage;
  let secondaryMessage;
  let handlePrimaryButton = handleDone;
  switch (status) {
    case RouteExecutionStatus.Done: {
      title =
        subvariant === 'nft'
          ? t('success.title.purchaseSuccessful')
          : t(`success.title.${transactionType}Successful`);
      if (token) {
        primaryMessage = t('success.message.exchangeSuccessful', {
          amount: formatTokenAmount(token.amount),
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
          walletAddress: shortenAddress(route.toAddress),
        });
      }
      handlePrimaryButton = handleDone;
      break;
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial: {
      title = t(`success.title.${transactionType}PartiallySuccessful`);
      primaryMessage = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      });
      if (token) {
        secondaryMessage = t('success.message.exchangeSuccessful', {
          amount: formatTokenAmount(token.amount),
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
          walletAddress: shortenAddress(route.toAddress),
        });
      }
      handlePrimaryButton = handlePartialDone;
      break;
    }
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded: {
      title = t('success.title.refundIssued');
      primaryMessage = t('success.message.exchangePartiallySuccessful', {
        tool: route.steps.at(-1)?.toolDetails.name,
        tokenSymbol: route.steps.at(-1)?.action.toToken.symbol,
      });
      if (token) {
        secondaryMessage = t('success.message.exchangeSuccessful', {
          amount: formatTokenAmount(token.amount),
          tokenSymbol: token.symbol,
          chainName: getChainById(token.chainId)?.name,
          walletAddress: shortenAddress(route.toAddress),
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

  const showContractComponent =
    subvariant === 'nft' && hasEnumFlag(status, RouteExecutionStatus.Done);

  return (
    <BottomSheet ref={ref}>
      <Box p={3}>
        {!showContractComponent ? (
          <CenterContainer>
            <IconCircle status={status} mb={1}>
              {status === RouteExecutionStatus.Idle ? (
                <InfoRoundedIcon color="primary" />
              ) : null}
              {status === RouteExecutionStatus.Done ? (
                <DoneIcon color="success" />
              ) : null}
              {hasEnumFlag(status, RouteExecutionStatus.Partial) ||
              hasEnumFlag(status, RouteExecutionStatus.Refunded) ? (
                <WarningRoundedIcon color="warning" />
              ) : null}
              {hasEnumFlag(status, RouteExecutionStatus.Failed) ? (
                <ErrorRoundedIcon color="error" />
              ) : null}
            </IconCircle>
          </CenterContainer>
        ) : null}
        <CenterContainer>
          <Typography py={1} fontSize={18} fontWeight={700}>
            {title}
          </Typography>
        </CenterContainer>
        {showContractComponent ? (
          contractCompactComponent ||
          contractSecondaryComponent ||
          contractComponent
        ) : (
          <CenterContainer>
            {hasEnumFlag(status, RouteExecutionStatus.Done) ? (
              <Token token={toToken} py={1} disableDescription />
            ) : null}
          </CenterContainer>
        )}
        {!showContractComponent ? (
          <Typography py={1}>{primaryMessage}</Typography>
        ) : null}
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
