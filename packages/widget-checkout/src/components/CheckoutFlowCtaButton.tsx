import { convertOrderToRoute, createFundingOrder, parseUnits } from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import {
  BaseTransactionButton,
  formatTokenAmount,
  useFieldValues,
  useRouteExecutionStoreContext,
  useSDKClient,
  useToAddressRequirements,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget/shared'
import { Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutModal } from '../CheckoutModal.js'
import { useCheckoutFlowQuote } from '../hooks/useCheckoutFlowQuote.js'
import { useFrozenQuote } from '../hooks/useFrozenQuote.js'
import { useOnRampQuote } from '../hooks/useOnRampQuote.js'
import { useResolvedCheckoutRecipient } from '../hooks/useResolvedCheckoutRecipient.js'
import { useOnRampSessionByCategory } from '../providers/OnRampProvider/OnRampProvider.js'
import {
  type CheckoutFundingSource,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import { useFundingOrderStore } from '../stores/useFundingOrderStore.js'
import {
  buildSmartDepositOrderRequest,
  buildStandardOrderRequest,
} from '../utils/buildOrderRequest.js'
import { normalizeFiatAmount } from '../utils/fiatFormat.js'
import {
  checkoutAbsolutePaths,
  checkoutNavigationRoutes,
} from '../utils/navigationRoutes.js'
import { CashHandoffSheet } from './CashHandoffSheet.js'

const ctaLabelKey = {
  wallet: 'button.pay',
  transfer: 'button.transferCrypto',
  exchange: 'button.connectExchange',
  cash: 'button.depositWithCash',
} as const satisfies Record<CheckoutFundingSource, string>

const statusPath = `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`

export const CheckoutFlowCtaButton: React.FC = (): JSX.Element => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const emitter = useWidgetEvents()
  const sdkClient = useSDKClient()
  const { account } = useAccount()
  const routeExecutionStore = useRouteExecutionStoreContext()
  const { toAddress, requiredToAddress } = useToAddressRequirements()
  const { recipient, isUserSettable } = useResolvedCheckoutRecipient()
  const { route, depositAddress, isError, refetch } = useCheckoutFlowQuote()
  const { freeze } = useFrozenQuote()
  const trackOrder = useFundingOrderStore((s) => s.track)
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource) ?? 'wallet'
  const setFrozenRouteId = useCheckoutFlowStore((s) => s.setFrozenRouteId)
  const selectedExchangeAccount = useCheckoutFlowStore(
    (s) => s.selectedExchangeAccount
  )
  const fiatCurrency = useFiatCurrencyStore((s) => s.currency)
  const paymentMethod = useFiatCurrencyStore((s) => s.paymentMethod)
  const [cashFiatAmount] = useFieldValues('cashFiatAmount')
  const onRampQuote = useOnRampQuote()
  const onRampSession = useOnRampSessionByCategory(
    fundingSource === 'cash' || fundingSource === 'exchange'
      ? fundingSource
      : null
  )
  const normalizedCashFiatAmount = normalizeFiatAmount(cashFiatAmount)
  const parsedFiatAmount = Number.parseFloat(normalizedCashFiatAmount)
  const hasFiatAmount =
    Number.isFinite(parsedFiatAmount) && parsedFiatAmount > 0

  const panelEl = useCheckoutModal()?.panelEl ?? null
  const [handoffOpen, setHandoffOpen] = useState(false)

  const createWalletOrder = useMutation({
    mutationFn: async () => {
      if (!route || !account.address) {
        throw new Error('No route or wallet for the deposit.')
      }
      return createFundingOrder(
        sdkClient,
        buildStandardOrderRequest({
          toChainId: route.toChainId,
          toTokenAddress: route.toToken.address,
          toAddress: route.toAddress ?? account.address,
          fromChainId: route.fromChainId,
          fromTokenAddress: route.fromToken.address,
          fromAmount: route.fromAmount,
          fromAddress: account.address,
        })
      )
    },
    onSuccess: (order) => {
      const orderRoute = convertOrderToRoute(order)
      routeExecutionStore.getState().setExecutableRoute(orderRoute)
      trackOrder({
        orderId: order.orderId,
        fundingSource: 'wallet',
        createdAt: Date.now(),
      })
      navigate({
        to: checkoutAbsolutePaths.transactionExecution,
        search: { routeId: order.orderId, checkoutAutoDeposit: true },
      })
      emitter.emit(WidgetEvent.RouteSelected, {
        route: orderRoute,
        routes: [orderRoute],
      })
    },
  })

  const handleWalletDeposit = useCallback(() => {
    createWalletOrder.mutate()
  }, [createWalletOrder])

  const createTransferOrder = useMutation({
    mutationFn: async () => {
      if (!route) {
        throw new Error('No route to derive the transfer request from.')
      }
      const order = await createFundingOrder(
        sdkClient,
        buildSmartDepositOrderRequest({
          toChainId: route.toChainId,
          toTokenAddress: route.toToken.address,
          toAddress: route.toAddress ?? route.fromAddress ?? '',
          fromChainId: route.fromChainId,
          fromTokenAddress: route.fromToken.address,
          fromAmount: route.fromAmount,
        })
      )
      return order
    },
    onSuccess: (order) => {
      trackOrder({
        orderId: order.orderId,
        fundingSource: 'transfer',
        createdAt: Date.now(),
      })
      navigate({
        to: checkoutNavigationRoutes.transferDeposit,
        search: { orderId: order.orderId },
      })
    },
  })

  const handleTransferDeposit = useCallback(() => {
    createTransferOrder.mutate()
  }, [createTransferOrder])

  const handleOnRampDeposit = useCallback(() => {
    if (!route || !depositAddress || !onRampSession) {
      return
    }
    freeze(
      route,
      fundingSource === 'cash'
        ? { fiatCurrency, fiatAmount: normalizedCashFiatAmount || undefined }
        : undefined
    )
    setFrozenRouteId(route.id)
    const cryptoAmount = formatTokenAmount(
      BigInt(route.fromAmount),
      route.fromToken.decimals
    )
    onRampSession.open({
      depositAddress,
      amount: cryptoAmount,
      fiatCurrency,
      fiatAmount:
        fundingSource === 'cash'
          ? normalizedCashFiatAmount || undefined
          : undefined,
      paymentMethod:
        fundingSource === 'cash' ? (paymentMethod ?? undefined) : undefined,
      fromChainId: route.fromChainId,
      fromTokenAddress: route.fromToken.address,
      accessTokens: selectedExchangeAccount
        ? [selectedExchangeAccount]
        : undefined,
      language: i18n.language,
    })
    navigate({
      to: statusPath,
      search: {
        depositAddress,
        fromChain: route.fromChainId,
      },
    })
  }, [
    route,
    depositAddress,
    onRampSession,
    freeze,
    setFrozenRouteId,
    fiatCurrency,
    normalizedCashFiatAmount,
    paymentMethod,
    fundingSource,
    navigate,
    selectedExchangeAccount,
    i18n.language,
  ])

  const handlersByFunding: Record<CheckoutFundingSource, () => void> = {
    wallet: handleWalletDeposit,
    transfer: handleTransferDeposit,
    exchange: handleOnRampDeposit,
    cash: handleOnRampDeposit,
  }

  const label = t(ctaLabelKey[fundingSource])

  const needsRecipient = isUserSettable && !recipient

  if (fundingSource === 'wallet' && !createWalletOrder.isError) {
    return (
      <BaseTransactionButton
        text={label}
        onClick={handleWalletDeposit}
        disabled={
          !route ||
          (requiredToAddress && !toAddress) ||
          needsRecipient ||
          createWalletOrder.isPending
        }
        route={route}
        sx={{ flex: 1 }}
      />
    )
  }

  const isCash = fundingSource === 'cash'
  let cashRouteMatchesQuote = !isCash
  if (isCash && route && onRampQuote.data?.funding?.estimatedAmount) {
    try {
      cashRouteMatchesQuote =
        parseUnits(
          onRampQuote.data.funding.estimatedAmount,
          route.fromToken.decimals
        ).toString() === route.fromAmount
    } catch {
      cashRouteMatchesQuote = false
    }
  }

  const cashNotReady =
    isCash &&
    (!hasFiatAmount ||
      !onRampQuote.isReady ||
      onRampQuote.isFetching ||
      onRampQuote.isDebouncePending ||
      !cashRouteMatchesQuote)

  if (
    isError ||
    (fundingSource === 'wallet' && createWalletOrder.isError) ||
    (fundingSource === 'transfer' && createTransferOrder.isError) ||
    (isCash && onRampQuote.isError)
  ) {
    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          refetch()
          onRampQuote.refetch()
          createWalletOrder.reset()
          createTransferOrder.reset()
        }}
        sx={{ flex: 1 }}
      >
        {t('button.tryAgain')}
      </Button>
    )
  }

  const primaryAction = isCash
    ? () => setHandoffOpen(true)
    : handlersByFunding[fundingSource]

  const isTransferPending =
    fundingSource === 'transfer' && createTransferOrder.isPending

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={primaryAction}
        disabled={
          !route ||
          !depositAddress ||
          needsRecipient ||
          cashNotReady ||
          isTransferPending
        }
        sx={{ flex: 1 }}
      >
        {label}
      </Button>
      {isCash && depositAddress ? (
        <CashHandoffSheet
          open={handoffOpen}
          depositAddress={depositAddress}
          container={panelEl}
          onContinue={() => {
            setHandoffOpen(false)
            handleOnRampDeposit()
          }}
          onGoBack={() => setHandoffOpen(false)}
        />
      ) : null}
    </Fragment>
  )
}
