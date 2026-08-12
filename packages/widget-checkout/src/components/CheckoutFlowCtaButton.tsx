import type { FundingOrder } from '@lifi/sdk'
import {
  convertOrderToRoute,
  createCexSession,
  createFundingOrder,
} from '@lifi/sdk'
import { useAccount } from '@lifi/wallet-management'
import {
  BaseTransactionButton,
  FormKeyHelper,
  formatTokenAmount,
  useFieldValues,
  useRouteExecutionStoreContext,
  useSDKClient,
  useToAddressRequirements,
  useWidgetConfig,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget/shared'
import { useCheckoutUserId } from '@lifi/widget-provider/checkout'
import { Button } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutModal } from '../CheckoutModal.js'
import { useCheckoutFlowQuote } from '../hooks/useCheckoutFlowQuote.js'
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
  buildOnrampOrderRequest,
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
  const { toChain, toToken } = useWidgetConfig()
  const checkoutUserId = useCheckoutUserId()
  const trackOrder = useFundingOrderStore((s) => s.track)
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource) ?? 'wallet'
  const selectedExchangeAccount = useCheckoutFlowStore(
    (s) => s.selectedExchangeAccount
  )
  const fiatCurrency = useFiatCurrencyStore((s) => s.currency)
  const paymentMethod = useFiatCurrencyStore((s) => s.paymentMethod)
  const [cashFiatAmount] = useFieldValues('cashFiatAmount')
  const [pinnedFromChainId, pinnedFromTokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey('from'),
    FormKeyHelper.getTokenKey('from')
  )
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
  // Reuses the SMART_DEPOSIT order across a CEX-session retry so Try Again
  // doesn't mint a second abandoned order server-side. Keyed on the request
  // tuple (not route.id): Try Again's refetch() re-quotes the route before
  // the retry, and a re-quote is not guaranteed to keep the same id even
  // when every field the order request reads is unchanged.
  const exchangeOrderRef = useRef<{
    requestKey: string
    order: FundingOrder
  } | null>(null)

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

  const createCashOrder = useMutation({
    mutationFn: async () => {
      if (!onRampSession) {
        throw new Error('No on-ramp session available for the cash deposit.')
      }
      if (typeof toChain !== 'number' || !toToken || !toAddress) {
        throw new Error('No destination configured for the cash deposit.')
      }
      if (typeof pinnedFromChainId !== 'number' || !pinnedFromTokenAddress) {
        throw new Error('No source asset configured for the cash deposit.')
      }
      const order = await createFundingOrder(
        sdkClient,
        buildOnrampOrderRequest({
          toChainId: toChain,
          toTokenAddress: toToken,
          toAddress,
          fiatAmount: normalizedCashFiatAmount,
          fiatCurrency,
          paymentMethod: paymentMethod ?? undefined,
        })
      )
      return {
        order,
        fromChainId: pinnedFromChainId,
        fromTokenAddress: pinnedFromTokenAddress,
      }
    },
    onSuccess: ({ order, fromChainId, fromTokenAddress }) => {
      trackOrder({
        orderId: order.orderId,
        fundingSource: 'cash',
        createdAt: Date.now(),
      })
      onRampSession?.open({
        depositAddress: order.depositAddress ?? '',
        amount: order.onramp?.estimatedFundingAmount ?? '',
        fiatCurrency,
        fiatAmount: normalizedCashFiatAmount || undefined,
        paymentMethod: paymentMethod ?? undefined,
        fromChainId,
        fromTokenAddress,
        language: i18n.language,
        widgetUrl: order.onramp?.widgetUrl,
      })
      navigate({
        to: statusPath,
        search: { orderId: order.orderId },
      })
    },
  })

  const handleCashDeposit = useCallback(() => {
    createCashOrder.mutate()
  }, [createCashOrder])

  const createExchangeOrder = useMutation({
    mutationFn: async () => {
      if (!onRampSession) {
        throw new Error(
          'No on-ramp session available for the exchange deposit.'
        )
      }
      if (!route) {
        throw new Error('No route to derive the exchange deposit from.')
      }
      const resolvedToAddress = route.toAddress ?? route.fromAddress ?? ''
      const requestKey = [
        route.fromChainId,
        route.fromToken.address,
        route.fromAmount,
        route.toChainId,
        route.toToken.address,
        resolvedToAddress,
      ].join(':')
      const order =
        exchangeOrderRef.current?.requestKey === requestKey
          ? exchangeOrderRef.current.order
          : await createFundingOrder(
              sdkClient,
              buildSmartDepositOrderRequest({
                toChainId: route.toChainId,
                toTokenAddress: route.toToken.address,
                toAddress: resolvedToAddress,
                fromChainId: route.fromChainId,
                fromTokenAddress: route.fromToken.address,
                fromAmount: route.fromAmount,
              })
            )
      if (!order.depositAddress) {
        throw new Error('Funding order has no deposit address.')
      }
      exchangeOrderRef.current = { requestKey, order }
      const session = await createCexSession(sdkClient, {
        walletAddress: order.depositAddress,
        tokenAddress: route.fromToken.address,
        chainId: route.fromChainId,
        userId: checkoutUserId,
      })
      return {
        order,
        linkToken: session.linkToken,
        amount: formatTokenAmount(
          BigInt(route.fromAmount),
          route.fromToken.decimals
        ),
        fromChainId: route.fromChainId,
        fromTokenAddress: route.fromToken.address,
      }
    },
    onSuccess: ({
      order,
      linkToken,
      amount,
      fromChainId,
      fromTokenAddress,
    }) => {
      trackOrder({
        orderId: order.orderId,
        fundingSource: 'exchange',
        createdAt: Date.now(),
      })
      onRampSession?.open({
        depositAddress: order.depositAddress ?? '',
        amount,
        fiatCurrency,
        fromChainId,
        fromTokenAddress,
        accessTokens: selectedExchangeAccount
          ? [selectedExchangeAccount]
          : undefined,
        language: i18n.language,
        linkToken,
      })
      navigate({
        to: statusPath,
        search: { orderId: order.orderId },
      })
      exchangeOrderRef.current = null
    },
  })

  const handleExchangeDeposit = useCallback(() => {
    createExchangeOrder.mutate()
  }, [createExchangeOrder])

  const handlersByFunding: Record<CheckoutFundingSource, () => void> = {
    wallet: handleWalletDeposit,
    transfer: handleTransferDeposit,
    exchange: handleExchangeDeposit,
    cash: handleCashDeposit,
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
  const isExchange = fundingSource === 'exchange'
  // Cash needs no client route — the ONRAMP order is fiat + destination only.
  const cashNotReady = isCash && !(hasFiatAmount && onRampQuote.isReady)

  if (
    isError ||
    (fundingSource === 'wallet' && createWalletOrder.isError) ||
    (fundingSource === 'transfer' && createTransferOrder.isError) ||
    (isExchange && createExchangeOrder.isError) ||
    (isCash && (onRampQuote.isError || createCashOrder.isError))
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
          createCashOrder.reset()
          createExchangeOrder.reset()
        }}
        sx={{ flex: 1 }}
      >
        {t('button.tryAgain')}
      </Button>
    )
  }

  // Cash always confirms the hand-off to the provider first: the sheet is a
  // "you are leaving for Transak" consent, not an address confirmation, and the
  // real ONRAMP deposit address only exists after `createFundingOrder`.
  const primaryAction = isCash
    ? () => setHandoffOpen(true)
    : handlersByFunding[fundingSource]

  const isTransferPending =
    fundingSource === 'transfer' && createTransferOrder.isPending
  const isExchangePending = isExchange && createExchangeOrder.isPending
  const isCashPending = isCash && createCashOrder.isPending
  // Transfer/exchange execute against the displayed route; cash doesn't.
  const requiresRoute = fundingSource === 'transfer' || isExchange

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={primaryAction}
        disabled={
          (requiresRoute && (!route || !depositAddress)) ||
          needsRecipient ||
          cashNotReady ||
          isTransferPending ||
          isExchangePending ||
          isCashPending
        }
        sx={{ flex: 1 }}
      >
        {label}
      </Button>
      {isCash ? (
        <CashHandoffSheet
          open={handoffOpen}
          container={panelEl}
          onContinue={() => {
            setHandoffOpen(false)
            handleCashDeposit()
          }}
          onGoBack={() => setHandoffOpen(false)}
        />
      ) : null}
    </Fragment>
  )
}
