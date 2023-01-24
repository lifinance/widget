import { Delete as DeleteIcon } from '@mui/icons-material';
import { Box, Button, Tooltip } from '@mui/material';
import { useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { GasSufficiencyMessage } from '../../components/GasSufficiencyMessage';
import { getStepList } from '../../components/Step';
import { useNavigateBack, useRouteExecution } from '../../hooks';
import { SwapFormKey, useWidgetConfig } from '../../providers';
import { RouteExecutionStatus } from '../../stores';
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet';
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet';
import { StartSwapButton } from './StartSwapButton';
import { StatusBottomSheet } from './StatusBottomSheet';
import { Container } from './SwapPage.style';
import {
  getTokenValueLossThreshold,
  TokenValueBottomSheet,
} from './TokenValueBottomSheet';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { variant } = useWidgetConfig();
  const { state }: any = useLocation();
  const { navigateBack } = useNavigateBack();
  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null);
  const exchangeRateBottomSheetRef = useRef<ExchangeRateBottomSheetBase>(null);
  const { setValue } = useFormContext();
  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution({
      routeId: state?.routeId,
      onAcceptExchangeRateUpdate: exchangeRateBottomSheetRef.current?.open,
    });

  const handleExecuteRoute = useCallback(() => {
    if (tokenValueBottomSheetRef.current?.isOpen()) {
      tokenValueBottomSheetRef.current?.close();
    }
    executeRoute();
    setValue(SwapFormKey.FromAmount, '');
  }, [executeRoute, setValue]);

  const handleSwapClick = async () => {
    if (status === RouteExecutionStatus.Idle) {
      const thresholdExceeded = getTokenValueLossThreshold(route);
      if (thresholdExceeded) {
        tokenValueBottomSheetRef.current?.open();
      } else {
        handleExecuteRoute();
      }
    }
    if (status === RouteExecutionStatus.Failed) {
      restartRoute();
    }
  };

  const handleRemoveRoute = () => {
    navigateBack();
    deleteRoute();
  };

  const getSwapButtonText = () => {
    switch (status) {
      case RouteExecutionStatus.Idle:
        return variant !== 'refuel'
          ? t(`button.startSwap`)
          : t(`button.startGasSwap`);
      case RouteExecutionStatus.Failed:
        return t('button.tryAgain');
      default:
        return '';
    }
  };

  return (
    <Container>
      {getStepList(route)}
      {status === RouteExecutionStatus.Idle ||
      status === RouteExecutionStatus.Failed ? (
        <>
          <GasSufficiencyMessage route={route} mt={2} />
          <Box mt={2} display="flex">
            <StartSwapButton
              text={getSwapButtonText()}
              onClick={handleSwapClick}
              currentRoute={route}
              // disabled={status === 'idle' && (isValidating || !isValid)}
            />
            {status === RouteExecutionStatus.Failed ? (
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
      {route ? (
        <ExchangeRateBottomSheet ref={exchangeRateBottomSheetRef} />
      ) : null}
    </Container>
  );
};
