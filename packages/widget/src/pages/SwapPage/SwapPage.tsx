import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Tooltip } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { GasMessage } from '../../components/GasMessage';
import { Insurance } from '../../components/Insurance';
import { getStepList } from '../../components/Step';
import { useNavigateBack, useRouteExecution, useSwapRoutes } from '../../hooks';
import { SwapFormKey, useWidgetConfig } from '../../providers';
import {
  RouteExecutionStatus,
  useRouteExecutionStore,
  useSetExecutableRoute,
} from '../../stores';
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet';
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet';
import { StartSwapButton } from './StartSwapButton';
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
  const { variant } = useWidgetConfig();
  const { state }: any = useLocation();
  const stateRouteId = state?.routeId;
  const [routeId, setRouteId] = useState(stateRouteId);

  const setExecutableRoute = useSetExecutableRoute();
  const routeExecution = useRouteExecutionStore(
    (state) => state.routes[stateRouteId],
  );

  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null);
  const exchangeRateBottomSheetRef = useRef<ExchangeRateBottomSheetBase>(null);

  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution({
      routeId: routeId,
      onAcceptExchangeRateUpdate: exchangeRateBottomSheetRef.current?.open,
    });

  const { routes, isLoading } = useSwapRoutes(routeExecution?.route);

  const toggleInsurance = (
    _: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const insuredRoute = routes?.[0];
    if (insuredRoute && checked) {
      setExecutableRoute(insuredRoute, stateRouteId);
    }
    setRouteId(checked ? insuredRoute?.id : stateRouteId);
  };

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

  const insuredRoute = routes?.[0] ?? route;

  return (
    <Container>
      {getStepList(route)}
      {(status === RouteExecutionStatus.Idle &&
        insuredRoute?.insurance?.state === 'INSURED') ||
      route?.insurance?.state === 'INSURED' ? (
        <Insurance
          mt={2}
          status={status}
          insurableRouteId={stateRouteId}
          feeAmountUsd={insuredRoute?.insurance.feeAmountUsd}
          available={insuredRoute?.insurance.state === 'INSURED'}
          onChange={toggleInsurance}
        />
      ) : null}
      {status === RouteExecutionStatus.Idle ||
      status === RouteExecutionStatus.Failed ? (
        <>
          <GasMessage mt={2} route={route} />
          <Box mt={2} display="flex">
            <StartSwapButton
              text={getSwapButtonText()}
              onClick={handleSwapClick}
              route={route}
              loading={isLoading}
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
