import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Tooltip } from '@mui/material';
import { useCallback, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { GasMessage } from '../../components/GasMessage';
import { Insurance } from '../../components/Insurance';
import { getStepList } from '../../components/Step';
import { useNavigateBack, useRouteExecution } from '../../hooks';
import { SwapFormKey, useWidgetConfig } from '../../providers';
import { RouteExecutionStatus } from '../../stores';
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet';
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet';
import { StartIdleSwapButton, StartSwapButton } from './StartSwapButton';
import { StatusBottomSheet } from './StatusBottomSheet';
import { Container } from './SwapPage.style';
import {
  TokenValueBottomSheet,
  getTokenValueLossThreshold,
} from './TokenValueBottomSheet';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const { navigateBack } = useNavigateBack();
  const { variant, insurance } = useWidgetConfig();
  const { state }: any = useLocation();
  const stateRouteId = state?.routeId;
  const [routeId, setRouteId] = useState<string>(stateRouteId);

  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null);
  const exchangeRateBottomSheetRef = useRef<ExchangeRateBottomSheetBase>(null);

  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution({
      routeId: routeId,
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

  const SwapButton =
    insurance && status === RouteExecutionStatus.Idle
      ? StartIdleSwapButton
      : StartSwapButton;

  const insuranceAvailable =
    insurance &&
    variant !== 'refuel' &&
    (route?.insurance?.state === 'INSURED' ||
      (status === RouteExecutionStatus.Idle &&
        route?.insurance?.state === 'INSURABLE'));

  const insuranceCoverageId =
    route?.steps[0].execution?.process
      .filter((process) => process.type !== 'TOKEN_ALLOWANCE')
      .find((process) => process.txHash)?.txHash ?? route?.fromAddress;

  return (
    <Container>
      {getStepList(route)}
      {insuranceAvailable ? (
        <Insurance
          mt={2}
          status={status}
          insurableRouteId={stateRouteId}
          feeAmountUsd={route?.insurance.feeAmountUsd}
          insuranceCoverageId={insuranceCoverageId}
          onChange={setRouteId}
        />
      ) : null}
      {status === RouteExecutionStatus.Idle ||
      status === RouteExecutionStatus.Failed ? (
        <>
          <GasMessage mt={2} route={route} />
          <Box mt={2} display="flex">
            <SwapButton
              text={getSwapButtonText()}
              onClick={handleSwapClick}
              route={route}
              insurableRouteId={stateRouteId}
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
