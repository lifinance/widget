import type { ExchangeRateUpdateParams } from '@lifi/sdk'
import { Delete } from '@mui/icons-material'
import { Box, Button, Tooltip } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { PageContainer } from '../../components/PageContainer.js'
import { getStepList } from '../../components/Step/StepList.js'
import { TransactionDetails } from '../../components/TransactionDetails.js'
import { useAddressActivity } from '../../hooks/useAddressActivity.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { WidgetEvent } from '../../types/events.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { ConfirmToAddressSheet } from './ConfirmToAddressSheet.js'
import type { ExchangeRateBottomSheetBase } from './ExchangeRateBottomSheet.js'
import { ExchangeRateBottomSheet } from './ExchangeRateBottomSheet.js'
import { RouteTracker } from './RouteTracker.js'
import { StartTransactionButton } from './StartTransactionButton.js'
import { StatusBottomSheet } from './StatusBottomSheet.js'
import { TokenValueBottomSheet } from './TokenValueBottomSheet.js'
import {
  calculateValueLossPercentage,
  getTokenValueLossThreshold,
} from './utils.js'

export const TransactionPage: React.FC = () => {
  const { t } = useTranslation()
  const { setFieldValue } = useFieldActions()
  const emitter = useWidgetEvents()
  const { navigateBack } = useNavigateBack()
  const { subvariant, subvariantOptions, contractSecondaryComponent } =
    useWidgetConfig()
  const { state }: any = useLocation()
  const stateRouteId = state?.routeId
  const [routeId, setRouteId] = useState<string>(stateRouteId)
  const [routeRefreshing, setRouteRefreshing] = useState(false)

  const tokenValueBottomSheetRef = useRef<BottomSheetBase>(null)
  const exchangeRateBottomSheetRef = useRef<ExchangeRateBottomSheetBase>(null)
  const confirmToAddressSheetRef = useRef<BottomSheetBase>(null)

  const onAcceptExchangeRateUpdate = (
    resolver: (value: boolean) => void,
    data: ExchangeRateUpdateParams
  ) => {
    exchangeRateBottomSheetRef.current?.open(resolver, data)
  }

  const { route, status, executeRoute, restartRoute, deleteRoute } =
    useRouteExecution({
      routeId: routeId,
      onAcceptExchangeRateUpdate,
    })

  const {
    toAddress,
    hasActivity,
    isLoading: isLoadingAddressActivity,
    isFetched: isActivityAddressFetched,
  } = useAddressActivity(route?.toChainId)

  const getHeaderTitle = () => {
    if (subvariant === 'custom') {
      return t(`header.${subvariantOptions?.custom ?? 'checkout'}`)
    }
    if (route) {
      const transactionType =
        route.fromChainId === route.toChainId ? 'swap' : 'bridge'
      return status === RouteExecutionStatus.Idle
        ? t(`button.${transactionType}Review`)
        : t(`header.${transactionType}`)
    }

    return t('header.exchange')
  }

  const headerAction = useMemo(
    () =>
      status === RouteExecutionStatus.Idle ? (
        <RouteTracker
          observableRouteId={stateRouteId}
          onChange={setRouteId}
          onFetching={setRouteRefreshing}
        />
      ) : undefined,
    [stateRouteId, status]
  )

  useHeader(getHeaderTitle(), headerAction)

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to emit event only when the page is mounted
  useEffect(() => {
    if (status === RouteExecutionStatus.Idle) {
      emitter.emit(WidgetEvent.ReviewTransactionPageEntered, route)
    }
  }, [])

  if (!route) {
    return null
  }

  const handleExecuteRoute = () => {
    if (tokenValueBottomSheetRef.current?.isOpen()) {
      const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
      const fromAmountUSD = Number.parseFloat(route.fromAmountUSD)
      const toAmountUSD = Number.parseFloat(route.toAmountUSD)
      emitter.emit(WidgetEvent.RouteHighValueLoss, {
        fromAmountUSD,
        toAmountUSD,
        gasCostUSD,
        feeCostUSD,
        valueLoss: calculateValueLossPercentage(
          fromAmountUSD,
          toAmountUSD,
          gasCostUSD,
          feeCostUSD
        ),
      })
    }
    tokenValueBottomSheetRef.current?.close()
    executeRoute()
    setFieldValue('fromAmount', '')
    if (subvariant === 'custom') {
      setFieldValue('fromToken', '')
      setFieldValue('toToken', '')
    }
  }

  const handleStartClick = async () => {
    if (status === RouteExecutionStatus.Idle) {
      if (
        toAddress &&
        !hasActivity &&
        !isLoadingAddressActivity &&
        isActivityAddressFetched
      ) {
        confirmToAddressSheetRef.current?.open()
        return
      }

      const { gasCostUSD, feeCostUSD } = getAccumulatedFeeCostsBreakdown(route)
      const fromAmountUSD = Number.parseFloat(route.fromAmountUSD)
      const toAmountUSD = Number.parseFloat(route.toAmountUSD)
      const tokenValueLossThresholdExceeded = getTokenValueLossThreshold(
        fromAmountUSD,
        toAmountUSD,
        gasCostUSD,
        feeCostUSD
      )
      if (tokenValueLossThresholdExceeded && subvariant !== 'custom') {
        tokenValueBottomSheetRef.current?.open()
      } else {
        handleExecuteRoute()
      }
    }
    if (status === RouteExecutionStatus.Failed) {
      restartRoute()
    }
  }

  const handleRemoveRoute = () => {
    navigateBack()
    deleteRoute()
  }

  const getButtonText = (): string => {
    switch (status) {
      case RouteExecutionStatus.Idle:
        switch (subvariant) {
          case 'custom':
            return subvariantOptions?.custom === 'deposit'
              ? t('button.deposit')
              : t('button.buy')
          case 'refuel':
            return t('button.startBridging')
          default: {
            const transactionType =
              route.fromChainId === route.toChainId ? 'Swapping' : 'Bridging'
            return t(`button.start${transactionType}`)
          }
        }
      case RouteExecutionStatus.Failed:
        return t('button.tryAgain')
      default:
        return ''
    }
  }

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
          <WarningMessages mt={2} route={route} allowInteraction />
          <Box
            sx={{
              mt: 2,
              display: 'flex',
            }}
          >
            <StartTransactionButton
              text={getButtonText()}
              onClick={handleStartClick}
              route={route}
              loading={routeRefreshing || isLoadingAddressActivity}
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
      <ConfirmToAddressSheet
        ref={confirmToAddressSheetRef}
        onContinue={handleExecuteRoute}
        toAddress={toAddress!}
        toChainId={route.toChainId!}
      />
    </PageContainer>
  )
}
