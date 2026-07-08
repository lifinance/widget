import { parseUnits } from '@lifi/sdk'
import {
  BaseTransactionButton,
  formatTokenAmount,
  useFieldValues,
  useToAddressRequirements,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget/shared'
import { Button } from '@mui/material'
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
  const { toAddress, requiredToAddress } = useToAddressRequirements()
  const { recipient, isUserSettable } = useResolvedCheckoutRecipient()
  const {
    route,
    routes,
    depositAddress,
    isError,
    refetch,
    setReviewableRoute,
  } = useCheckoutFlowQuote()
  const { freeze } = useFrozenQuote()
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

  const handleWalletDeposit = useCallback(() => {
    if (!route) {
      return
    }
    setReviewableRoute(route)
    navigate({
      to: checkoutAbsolutePaths.transactionExecution,
      search: { routeId: route.id, checkoutAutoDeposit: true },
    })
    emitter.emit(WidgetEvent.RouteSelected, {
      route,
      routes: routes ?? [route],
    })
  }, [route, routes, setReviewableRoute, navigate, emitter])

  const handleTransferDeposit = useCallback(() => {
    if (!route || !depositAddress) {
      return
    }
    freeze(route)
    setFrozenRouteId(route.id)
    navigate({ to: checkoutNavigationRoutes.transferDeposit })
  }, [route, depositAddress, freeze, setFrozenRouteId, navigate])

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

  if (fundingSource === 'wallet') {
    return (
      <BaseTransactionButton
        text={label}
        onClick={handleWalletDeposit}
        disabled={!route || (requiredToAddress && !toAddress) || needsRecipient}
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

  if (isError || (isCash && onRampQuote.isError)) {
    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          refetch()
          onRampQuote.refetch()
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

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={primaryAction}
        disabled={!route || !depositAddress || needsRecipient || cashNotReady}
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
