import type { BottomSheetBase } from '@lifi/widget/components/BottomSheet';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, Tooltip } from '@mui/material';
import { Fragment, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { GasSufficiencyMessage } from '../../components/GasSufficiencyMessage';
import { Step } from '../../components/Step';
import { StepDivider } from '../../components/StepDivider';
import { SwapButton } from '../../components/SwapButton';
import { useNavigateBack, useRouteExecution } from '../../hooks';
import { SwapFormKey } from '../../providers';
import { StatusBottomSheet } from './StatusBottomSheet';
import { Container } from './SwapPage.style';
import {
  getTokenValueLossThreshold,
  TokenValueBottomSheet,
} from './TokenValueBottomSheet';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { state }: any = useLocation();
  const { navigateBack } = useNavigateBack();
  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null);
  const { setValue } = useFormContext();
  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution(state?.routeId);

  const handleExecuteRoute = useCallback(() => {
    if (tokenValueBottomSheetRef.current?.isOpen()) {
      tokenValueBottomSheetRef.current?.close();
    }
    executeRoute();
    setValue(SwapFormKey.FromAmount, '');
  }, [executeRoute, setValue]);

  const handleSwapClick = async () => {
    if (status === 'idle') {
      const thresholdExceeded = getTokenValueLossThreshold(route);
      if (thresholdExceeded) {
        tokenValueBottomSheetRef.current?.open();
      } else {
        handleExecuteRoute();
      }
    }
    if (status === 'error') {
      restartRoute();
    }
  };

  const handleRemoveRoute = () => {
    navigateBack();
    deleteRoute();
  };

  const getSwapButtonText = () => {
    switch (status) {
      case 'idle':
        return t('button.startSwap');
      case 'error':
        return t('button.restartSwap');
      default:
        return '';
    }
  };

  return (
    <Container>
      {route?.steps.map((step, index, steps) => (
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
      {status === 'idle' || status === 'error' ? (
        <>
          <GasSufficiencyMessage route={route} mt={2} />
          <Box mt={2} display="flex">
            <SwapButton
              text={getSwapButtonText()}
              onClick={handleSwapClick}
              currentRoute={route}
              // disable={status === 'idle' && (isValidating || !isValid)}
              enableLoading
            />
            {status === 'error' ? (
              <Tooltip
                title={t('button.removeSwap')}
                placement="bottom-end"
                enterDelay={400}
                arrow
              >
                <Button
                  onClick={handleRemoveRoute}
                  sx={{
                    minWidth: 48,
                    marginLeft: 1,
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Tooltip>
            ) : null}
          </Box>
        </>
      ) : null}
      {route && status ? (
        <StatusBottomSheet status={status} route={route} />
      ) : null}
      {route ? (
        <TokenValueBottomSheet
          route={route}
          ref={tokenValueBottomSheetRef}
          onContinue={handleExecuteRoute}
        />
      ) : null}
    </Container>
  );
};
