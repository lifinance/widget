import DoneIcon from '@mui/icons-material/Done';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Box, Button, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { BottomSheet } from '../../components/BottomSheet';
import { Token } from '../../components/Token';
import {
  getProcessMessage,
  useAvailableChains,
  useNavigateBack,
  useTokenBalance,
} from '../../hooks';
import { useWidgetConfig } from '../../providers';
import type { RouteExecution } from '../../stores';
import {
  RouteExecutionStatus,
  getSourceTxHash,
  useFieldActions,
} from '../../stores';
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
  const queryClient = useQueryClient();
  const { setFieldValue } = useFieldActions();
  const {
    subvariant,
    contractComponent,
    contractSecondaryComponent,
    contractCompactComponent,
  } = useWidgetConfig();
  const { getChainById } = useAvailableChains();

  const toToken = {
    ...(route.steps.at(-1)?.execution?.toToken ?? route.toToken),
    amount: BigInt(
      route.steps.at(-1)?.execution?.toAmount ??
        route.steps.at(-1)?.estimate.toAmount ??
        route.toAmount,
    ),
  };

  const toChain = getChainById(toToken.chainId);

  const { token, refetch, refetchNewBalance, refetchAllBalances } =
    useTokenBalance(route.toAddress, toToken, toChain);

  const invalidateQueries = () => {
    refetchAllBalances();
    setFieldValue('fromAmount', '');
    setFieldValue('toAmount', '');
    queryClient.invalidateQueries({ queryKey: ['transaction-history'] });
  };

  const handleDone = () => {
    invalidateQueries();
    navigateBack();
  };

  const handlePartialDone = () => {
    invalidateQueries();
    if (
      toToken.chainId !== route.toToken.chainId &&
      toToken.address !== route.toToken.address
    ) {
      setFieldValue(
        'fromAmount',
        formatTokenAmount(toToken.amount, toToken.decimals),
        { isTouched: true },
      );
      setFieldValue('fromChain', toToken.chainId, { isTouched: true });
      setFieldValue('fromToken', toToken.address, { isTouched: true });
      setFieldValue('toChain', route.toToken.chainId, {
        isTouched: true,
      });
      setFieldValue('toToken', route.toToken.address, {
        isTouched: true,
      });
    }
    navigateBack();
  };

  const handleClose = () => {
    invalidateQueries();
    ref.current?.close();
  };

  const handleSeeDetails = () => {
    handleClose();

    const transactionHash = getSourceTxHash(route);

    navigate(navigationRoutes.transactionDetails, {
      state: {
        routeId: route.id,
        transactionHash,
      },
      replace: true,
    });
  };

  const transactionType =
    route.fromChainId === route.toChainId ? 'swap' : 'bridge';

  let title: string | undefined;
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
          amount: formatTokenAmount(token.amount, token.decimals),
          tokenSymbol: token.symbol,
          chainName: toChain?.name,
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
          amount: formatTokenAmount(token.amount, token.decimals),
          tokenSymbol: token.symbol,
          chainName: toChain?.name,
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
          amount: formatTokenAmount(token.amount, token.decimals),
          tokenSymbol: token.symbol,
          chainName: toChain?.name,
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
