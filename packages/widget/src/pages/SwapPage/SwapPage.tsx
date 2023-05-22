import type { ExchangeRateUpdateParams } from '@lifi/sdk';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import type { BottomSheetBase } from '../../components/BottomSheet';
import { ContractComponent } from '../../components/ContractComponent';
import { GasMessage } from '../../components/GasMessage';
import { Insurance } from '../../components/Insurance';
import { getStepList } from '../../components/Step';
import {
  useNavigateBack,
  useRouteExecution,
  useWidgetEvents,
} from '../../hooks';
import { SwapFormKey, useWidgetConfig } from '../../providers';
import { RouteExecutionStatus } from '../../stores';
import { WidgetEvent } from '../../types/events';
import { formatTokenAmount } from '../../utils';
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet';
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet';
import { StartIdleSwapButton, StartSwapButton } from './StartSwapButton';
import { StatusBottomSheet } from './StatusBottomSheet';
import { Container } from './SwapPage.style';
import {
  TokenValueBottomSheet,
  getTokenValueLossThreshold,
} from './TokenValueBottomSheet';
import { calcValueLoss } from './utils';

export const SwapPage: React.FC = () => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();
  const emitter = useWidgetEvents();
  const { navigateBack } = useNavigateBack();
  const { variant, insurance } = useWidgetConfig();
  const { state }: any = useLocation();
  const stateRouteId = state?.routeId;
  const [routeId, setRouteId] = useState<string>(stateRouteId);

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

  const tokenValueLossThresholdExceeded = getTokenValueLossThreshold(route);

  const handleExecuteRoute = () => {
    if (tokenValueBottomSheetRef.current?.isOpen()) {
      if (route) {
        emitter.emit(WidgetEvent.RouteHighValueLoss, {
          fromAmountUsd: route.fromAmountUSD,
          gasCostUSD: route.gasCostUSD,
          toAmountUSD: route.toAmountUSD,
          valueLoss: calcValueLoss(route),
        });
      }
      tokenValueBottomSheetRef.current?.close();
    }
    executeRoute();
    setValue(SwapFormKey.FromAmount, '');
  };

  const handleSwapClick = async () => {
    if (status === RouteExecutionStatus.Idle) {
      if (tokenValueLossThresholdExceeded && variant !== 'nft') {
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
        switch (variant) {
          case 'nft':
            return t('button.buyNow');
          case 'refuel':
            return t('button.startGasSwap');
          default:
            return t('button.startSwap');
        }
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
      {variant === 'nft' ? <ContractComponent mt={2} /> : null}
      {route && insuranceAvailable ? (
        <Insurance
          mt={2}
          status={status}
          insurableRouteId={stateRouteId}
          feeAmountUsd={route.insurance.feeAmountUsd}
          insuredAmount={formatTokenAmount(
            route.toAmountMin,
            route.toToken.decimals,
          )}
          insuredTokenSymbol={route.toToken.symbol}
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
      {route && tokenValueLossThresholdExceeded && variant !== 'nft' ? (
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
