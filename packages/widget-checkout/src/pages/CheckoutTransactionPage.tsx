import type { ExchangeRateUpdateParams, RouteExtended } from '@lifi/sdk'
import { stopRouteExecution } from '@lifi/sdk'
import type {
  BottomSheetBase,
  ExchangeRateBottomSheetBase,
} from '@lifi/widget/shared'
import {
  Card,
  ConfirmToAddressSheet,
  ContractComponent,
  calculateValueLossPercentage,
  ExchangeRateBottomSheet,
  getAccumulatedFeeCostsBreakdown,
  getSourceTxHash,
  getTokenValueLossThreshold,
  hasEnumFlag,
  navigationRoutes,
  PageContainer,
  RouteExecutionStatus,
  RouteTokens,
  RouteTracker,
  StartTransactionButton,
  TokenValueBottomSheet,
  TransactionDoneButtons,
  useAddressActivity,
  useFieldActions,
  useHeader,
  useHeaderStore,
  useNavigateBack,
  useRouteExecution,
  useWidgetConfig,
  useWidgetEvents,
  WarningMessages,
  WidgetEvent,
} from '@lifi/widget/shared'
import Delete from '@mui/icons-material/Delete'
import { Box, Button, Tooltip } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckoutExecutionProgress } from '../components/CheckoutExecutionProgress.js'
import { FROZEN_QUOTE_TTL_MS, useFrozenQuote } from '../hooks/useFrozenQuote.js'
import { usePendingCheckoutWriter } from '../hooks/usePendingCheckoutWriter.js'
import { extractDepositAddress } from '../utils/extractDepositAddress.js'
import { getSourceTxIdentifier } from '../utils/getSourceTxIdentifier.js'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'

const statusPath = `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`

function PendingCheckoutWalletHandoff({
  route,
  handoffEnabled,
  onHandoff,
}: {
  route: RouteExtended | undefined
  handoffEnabled: boolean
  onHandoff: () => void
}): null {
  const navigate = useNavigate()
  const { writeWallet } = usePendingCheckoutWriter()
  const { freeze } = useFrozenQuote()
  // Only an identifier appearing live triggers handoff; one already present on
  // first observe belongs to a prior execution (route state is reused across
  // identical quotes).
  const observedRef = useRef<{
    routeId: string
    skipValue: string | null
    handledValue: string | null
  } | null>(null)
  useEffect(() => {
    if (!route) {
      observedRef.current = null
      return
    }
    const identifier = getSourceTxIdentifier(route) ?? null
    const observed = observedRef.current
    if (!observed || observed.routeId !== route.id) {
      observedRef.current = {
        routeId: route.id,
        skipValue: identifier?.value ?? null,
        handledValue: null,
      }
      return
    }
    if (
      !identifier ||
      identifier.value === observed.skipValue ||
      identifier.value === observed.handledValue
    ) {
      return
    }
    observed.handledValue = identifier.value
    const depositAddress = extractDepositAddress(route) ?? undefined
    writeWallet({
      identifier,
      fromChain: route.fromChainId,
      depositAddress,
      frozenQuote: {
        id: route.id,
        route,
        expiresAt: Date.now() + FROZEN_QUOTE_TTL_MS,
      },
    })
    if (!handoffEnabled || !depositAddress) {
      return
    }
    // IF routes are relayer-fulfilled and tracked by deposit address from here:
    // stop background execution and drop the route so a re-quote can't resurface it.
    freeze(route)
    stopRouteExecution(route)
    onHandoff()
    navigate({
      to: statusPath,
      search: {
        depositAddress,
        fromChain: route.fromChainId,
        ...(identifier.kind === 'txHash'
          ? { transactionHash: identifier.value }
          : { taskId: identifier.value }),
      },
      replace: true,
    })
  }, [route, handoffEnabled, writeWallet, freeze, navigate, onHandoff])
  return null
}

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

export const CheckoutTransactionPage = (): JSX.Element | null => {
  const { t } = useTranslation()
  const { setFieldValue } = useFieldActions()
  const emitter = useWidgetEvents()
  const setBackAction = useHeaderStore((state) => state.setBackAction)
  const navigate = useNavigate()
  const navigateBack = useNavigateBack()
  const { mode, modeOptions, contractSecondaryComponent, hiddenUI, defaultUI } =
    useWidgetConfig()
  const { search }: { search?: Record<string, unknown> } = useLocation()
  const stateRouteId = search?.routeId as string | undefined
  const shouldAutoCheckoutDeposit = useMemo(
    () =>
      Boolean(search?.checkoutAutoDeposit) &&
      mode === 'custom' &&
      modeOptions?.custom?.type === 'deposit',
    [search?.checkoutAutoDeposit, mode, modeOptions?.custom?.type]
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
    if (mode === 'custom') {
      return t('header.checkout')
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
      mode === 'custom' && modeOptions?.custom?.type === 'deposit'
    if (mode === 'custom' && !isDepositCheckout) {
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
        !hiddenUI?.lowAddressActivityConfirmation
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
      if (tokenValueLossThresholdExceeded && mode !== 'custom') {
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
        switch (mode) {
          case 'custom':
            return t('button.pay')
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
      <PendingCheckoutWalletHandoff
        route={route}
        handoffEnabled={
          mode === 'custom' && modeOptions?.custom?.type === 'deposit'
        }
        onHandoff={deleteRoute}
      />
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
          <CheckoutExecutionProgress route={route} status={status} />
        )}
        {mode === 'custom' && contractSecondaryComponent ? (
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
        {hasEnumFlag(status, RouteExecutionStatus.Done) ? (
          <Box sx={{ mt: 1.5, display: 'flex', gap: 2 }}>
            <Button
              variant="text"
              fullWidth
              size="large"
              sx={{ flex: 1 }}
              onClick={() => {
                const txHash = getSourceTxHash(route)
                if (!txHash) {
                  return
                }
                navigate({
                  to: `/${navigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionDetails}`,
                  search: { transactionHash: txHash },
                })
              }}
            >
              {t('checkout.transactionStatus.seeDetails')}
            </Button>
            <Box sx={{ flex: 1 }}>
              <TransactionDoneButtons route={route} status={status} />
            </Box>
          </Box>
        ) : null}
        {mode !== 'custom' ? (
          <TokenValueBottomSheet
            route={route}
            ref={tokenValueBottomSheetRef}
            onContinue={handleExecuteRoute}
          />
        ) : null}
        <ExchangeRateBottomSheet ref={exchangeRateBottomSheetRef} />
        {!hiddenUI?.lowAddressActivityConfirmation ? (
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
