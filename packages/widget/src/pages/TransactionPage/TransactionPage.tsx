import type { ExchangeRateUpdateParams } from '@lifi/sdk';
import { Delete } from '@mui/icons-material';
import { Box, Button, Tooltip } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js';
import { GasMessage } from '../../components/GasMessage/GasMessage.js';
import { PageContainer } from '../../components/PageContainer.js';
import { getStepList } from '../../components/Step/StepList.js';
import { TransactionDetails } from '../../components/TransactionDetails.js';
import { useHeader } from '../../hooks/useHeader.js';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useRouteExecution } from '../../hooks/useRouteExecution.js';
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { RouteExecutionStatus } from '../../stores/routes/types.js';
import { WidgetEvent } from '../../types/events.js';
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js';
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet.js';
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet.js';
import { RouteTracker } from './RouteTracker.js';
import { StartTransactionButton } from './StartTransactionButton.js';
import { StatusBottomSheet } from './StatusBottomSheet.js';
import { TokenValueBottomSheet } from './TokenValueBottomSheet.js';
import {
  calculateValueLossPercentage,
  getTokenValueLossThreshold,
} from './utils.js';

export const TransactionPage: React.FC = () => {
  const { t } = useTranslation();
  const { setFieldValue } = useFieldActions();
  const emitter = useWidgetEvents();
  const { navigateBack } = useNavigateBack();
  const { subvariant, contractSecondaryComponent } = useWidgetConfig();
  const { state }: any = useLocation();
  const stateRouteId = state?.routeId;
  const [routeId, setRouteId] = useState<string>(stateRouteId);
  const [routeRefreshing, setRouteRefreshing] = useState(false);

  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null);
  const exchangeRateBottomSheetRef = useRef<ExchangeRateBottomSheetBase>(null);

  const onAcceptExchangeRateUpdate = (
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams,
  ) => {
    exchangeRateBottomSheetRef.current?.open(resolver, data);
  };

  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution({
      routeId: routeId,
      onAcceptExchangeRateUpdate,
    });

  const getHeaderTitle = () => {
    if (subvariant === 'custom') {
      return t(`header.purchase`);
    } else {
      if (route) {
        const transactionType =
          route.fromChainId === route.toChainId ? 'Swap' : 'Bridge';

        return status === RouteExecutionStatus.Idle
          ? t(`button.review${transactionType}`)
          : t(`header.${transactionType.toLowerCase() as 'swap' | 'bridge'}`);
      }
    }

    return t(`header.exchange`);
  };

  const headerAction = useMemo(
    () =>
      status === RouteExecutionStatus.Idle ? (
        <RouteTracker
          observableRouteId={stateRouteId}
          onChange={setRouteId}
          onFetching={setRouteRefreshing}
        />
      ) : undefined,
    [stateRouteId, status],
  );

  useHeader(getHeaderTitle(), headerAction);

  useEffect(() => {
    if (status === RouteExecutionStatus.Idle) {
      emitter.emit(WidgetEvent.ReviewTransactionPageEntered, route);
    }
    // We want to emit event only when the page is mounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!route) {
    return null;
  }

  const handleExecuteRoute = () => {
    if (tokenValueBottomSheetRef.current?.isOpen()) {
      const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route);
      const fromAmountUSD = parseFloat(route.fromAmountUSD);
      const toAmountUSD = parseFloat(route.toAmountUSD);
      emitter.emit(WidgetEvent.RouteHighValueLoss, {
        fromAmountUSD,
        toAmountUSD,
        gasCostUSD,
        feeCostUSD,
        valueLoss: calculateValueLossPercentage(
          fromAmountUSD,
          toAmountUSD,
          gasCostUSD,
          feeCostUSD,
        ),
      });
    }
    tokenValueBottomSheetRef.current?.close();
    executeRoute();
    setFieldValue('fromAmount', '');
    if (subvariant === 'custom') {
      setFieldValue('fromToken', '');
      setFieldValue('toToken', '');
    }
  };

  const handleStartClick = async () => {
    if (status === RouteExecutionStatus.Idle) {
      const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route);
      const fromAmountUSD = parseFloat(route.fromAmountUSD);
      const toAmountUSD = parseFloat(route.toAmountUSD);
      const tokenValueLossThresholdExceeded = getTokenValueLossThreshold(
        fromAmountUSD,
        toAmountUSD,
        gasCostUSD,
        feeCostUSD,
      );
      if (tokenValueLossThresholdExceeded && subvariant !== 'custom') {
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

  const getButtonText = (): string => {
    switch (status) {
      case RouteExecutionStatus.Idle:
        switch (subvariant) {
          case 'custom':
            return t('button.buyNow');
          case 'refuel':
            return t('button.startBridging');
          default:
            const transactionType =
              route.fromChainId === route.toChainId ? 'Swapping' : 'Bridging';
            return t(`button.start${transactionType}`);
        }
      case RouteExecutionStatus.Failed:
        return t('button.tryAgain');
      default:
        return '';
    }
  };

  return (
    <PageContainer bottomGutters>
      {getStepList(route, subvariant)}
      {subvariant === 'custom' && contractSecondaryComponent ? (
        <ContractComponent sx={{ marginTop: 2 }}>
          {contractSecondaryComponent}
        </ContractComponent>
      ) : null}
      <TransactionDetails route={route} sx={{ marginTop: 2 }} />
      {status === RouteExecutionStatus.Idle ||
      status === RouteExecutionStatus.Failed ? (
        <>
          <GasMessage mt={2} route={route} />
          <Box mt={2} display="flex">
            <StartTransactionButton
              text={getButtonText()}
              onClick={handleStartClick}
              route={route}
              loading={routeRefreshing}
            />
            {status === RouteExecutionStatus.Failed ? (
              <Tooltip
                title={t('button.removeTransaction')}
                placement="bottom-end"
              >
                <Button
                  onClick={handleRemoveRoute}
                  sx={{
                    minWidth: 48,
                    marginLeft: 1,
                  }}
                >
                  <Delete />
                </Button>
              </Tooltip>
            ) : null}
          </Box>
        </>
      ) : null}
      {status ? <StatusBottomSheet status={status} route={route} /> : null}
      {subvariant !== 'custom' ? (
        <TokenValueBottomSheet
          route={route}
          ref={tokenValueBottomSheetRef}
          onContinue={handleExecuteRoute}
        />
      ) : null}
      <ExchangeRateBottomSheet ref={exchangeRateBottomSheetRef} />
    </PageContainer>
  );
};
