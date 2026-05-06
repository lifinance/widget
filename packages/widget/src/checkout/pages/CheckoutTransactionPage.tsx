import type { ExchangeRateUpdateParams, RouteExtended } from '@lifi/sdk'
import Delete from '@mui/icons-material/Delete'
import { Box, Button, Tooltip } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { Card } from '../../components/Card/Card.js'
import { ContractComponent } from '../../components/ContractComponent/ContractComponent.js'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { PageContainer } from '../../components/PageContainer.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { useAddressActivity } from '../../hooks/useAddressActivity.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { ConfirmToAddressSheet } from '../../pages/TransactionPage/ConfirmToAddressSheet.js'
import type { ExchangeRateBottomSheetBase } from '../../pages/TransactionPage/ExchangeRateBottomSheet.js'
import { ExchangeRateBottomSheet } from '../../pages/TransactionPage/ExchangeRateBottomSheet.js'
import { ExecutionProgressCards } from '../../pages/TransactionPage/ExecutionProgressCards.js'
import { RouteTracker } from '../../pages/TransactionPage/RouteTracker.js'
import { StartTransactionButton } from '../../pages/TransactionPage/StartTransactionButton.js'
import { TokenValueBottomSheet } from '../../pages/TransactionPage/TokenValueBottomSheet.js'
import { TransactionDoneButtons } from '../../pages/TransactionPage/TransactionDoneButtons.js'
import {
  calculateValueLossPercentage,
  getTokenValueLossThreshold,
} from '../../pages/TransactionPage/utils.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useHeaderStore } from '../../stores/header/useHeaderStore.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { WidgetEvent } from '../../types/events.js'
import { HiddenUI } from '../../types/widget.js'
import { getAccumulatedFeeCostsBreakdown } from '../../utils/fees.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'

function CheckoutDepositAutoStarter({
  enabled,
  routeId,
  route,
  status,
  onTrigger,
}: {
  enabled: boolean
  routeId: string
  route: RouteExtended
  status: RouteExecutionStatus
  onTrigger: () => void | Promise<void>
}): null {
  useEffect(() => {
    const sessionKey = `lifi-checkout-autodeposit-${routeId}`
    if (!enabled) {
      return
    }
    if (status !== RouteExecutionStatus.Idle) {
      return
    }
    if (!route?.id || route.id !== routeId) {
      return
    }
    if (sessionStorage.getItem(sessionKey)) {
      return
    }
    sessionStorage.setItem(sessionKey, '1')
    void onTrigger()
  }, [enabled, onTrigger, route?.id, routeId, status])

  useEffect(() => {
    if (!enabled) {
      return
    }
    const sessionKey = `lifi-checkout-autodeposit-${routeId}`
    if (status !== RouteExecutionStatus.Idle) {
      sessionStorage.removeItem(sessionKey)
    }
  }, [enabled, routeId, status])

  return null
}

/**
 * Checkout transaction / execution UI — mirrors `TransactionPage` with deposit-checkout-only behavior:
 * optional auto-start from `checkoutAutoDeposit` search param, preserve receive `toToken` on execute when
 * the flow fails so back navigation keeps quotes coherent.
 */
export const CheckoutTransactionPage = (): JSX.Element | null => {
  const { t } = useTranslation()
  const { setFieldValue } = useFieldActions()
  const emitter = useWidgetEvents()
  const setBackAction = useHeaderStore((state) => state.setBackAction)
  const navigate = useNavigate()
  const navigateBack = useNavigateBack()
  const {
    subvariant,
    subvariantOptions,
    contractSecondaryComponent,
    hiddenUI,
    defaultUI,
  } = useWidgetConfig()
  const { search }: { search?: Record<string, unknown> } = useLocation()
  const stateRouteId = search?.routeId as string | undefined
  const shouldAutoCheckoutDeposit = useMemo(
    () =>
      Boolean(search?.checkoutAutoDeposit) &&
      subvariant === 'custom' &&
      subvariantOptions?.custom === 'deposit',
    [search?.checkoutAutoDeposit, subvariant, subvariantOptions?.custom]
  )

  const [routeId, setRouteId] = useState<string>(stateRouteId ?? '')
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
          observableRouteId={stateRouteId ?? ''}
          onChange={setRouteId}
          onFetching={setRouteRefreshing}
        />
      ) : undefined,
    [stateRouteId, status]
  )

  useHeader(getHeaderTitle(), headerAction)

  if (!route || !status) {
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
    const isDepositCheckout =
      subvariant === 'custom' && subvariantOptions?.custom === 'deposit'
    if (subvariant === 'custom' && !isDepositCheckout) {
      setFieldValue('fromToken', '')
      setFieldValue('toToken', '')
    }
    setBackAction(() => {
      // Deposit checkout: send users back to EnterAmountPage so the preserved fromToken/fromAmount
      // remain editable after a failed execution. Other flows return to home as before.
      navigate({
        to: isDepositCheckout
          ? checkoutNavigationRoutes.enterAmount
          : navigationRoutes.home,
        replace: true,
      })
    })
  }

  const handleStartClick = async () => {
    if (status === RouteExecutionStatus.Idle) {
      if (
        toAddress &&
        !hasActivity &&
        !isLoadingAddressActivity &&
        isActivityAddressFetched &&
        !hiddenUI?.includes(HiddenUI.LowAddressActivityConfirmation)
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
    <>
      {shouldAutoCheckoutDeposit &&
      route &&
      routeId &&
      status === RouteExecutionStatus.Idle ? (
        <CheckoutDepositAutoStarter
          enabled
          routeId={routeId}
          route={route}
          status={status}
          onTrigger={handleStartClick}
        />
      ) : null}
      <PageContainer bottomGutters>
        {status === RouteExecutionStatus.Idle ? (
          <Card type="default" indented>
            <RouteTokens
              route={route}
              showEssentials
              defaultExpanded={defaultUI?.transactionDetailsExpanded}
            />
          </Card>
        ) : (
          <ExecutionProgressCards route={route} status={status} />
        )}
        {subvariant === 'custom' && contractSecondaryComponent ? (
          <ContractComponent sx={{ marginTop: 2 }}>
            {contractSecondaryComponent}
          </ContractComponent>
        ) : null}
        {status === RouteExecutionStatus.Idle ||
        status === RouteExecutionStatus.Failed ? (
          <>
            <WarningMessages sx={{ mt: 2 }} route={route} allowInteraction />
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
                  title={t('button.clearTransaction')}
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
        <TransactionDoneButtons route={route} status={status} />
        {subvariant !== 'custom' ? (
          <TokenValueBottomSheet
            route={route}
            ref={tokenValueBottomSheetRef}
            onContinue={handleExecuteRoute}
          />
        ) : null}
        <ExchangeRateBottomSheet ref={exchangeRateBottomSheetRef} />
        {!hiddenUI?.includes(HiddenUI.LowAddressActivityConfirmation) ? (
          <ConfirmToAddressSheet
            ref={confirmToAddressSheetRef}
            onContinue={handleExecuteRoute}
            toAddress={toAddress!}
            toChainId={route.toChainId!}
          />
        ) : null}
      </PageContainer>
    </>
  )
}
