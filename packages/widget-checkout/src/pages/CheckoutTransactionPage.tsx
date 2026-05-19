import type { ExchangeRateUpdateParams, RouteExtended } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
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
  ExecutionProgressCards,
  getAccumulatedFeeCostsBreakdown,
  getSourceTxHash,
  getTokenValueLossThreshold,
  HiddenUI,
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
import { useCheckoutFlowStore } from '../stores/useCheckoutFlowStore.js'
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

  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const { account } = useAccount()

  // Detect wallet disconnect during active execution and surface the error screen.
  useEffect(() => {
    if (
      fundingSource !== 'wallet' ||
      account.address !== undefined ||
      !hasEnumFlag(status ?? 0, RouteExecutionStatus.Pending)
    ) {
      return
    }
    navigate({
      to: `/${navigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`,
      search: { walletDisconnected: true },
    })
  }, [fundingSource, account.address, status, navigate])

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
