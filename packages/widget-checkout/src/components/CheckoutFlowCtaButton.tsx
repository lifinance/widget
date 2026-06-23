import {
  BaseTransactionButton,
  formatTokenAmount,
  useToAddressRequirements,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget/shared'
import { Button } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useCheckoutFlowQuote } from '../hooks/useCheckoutFlowQuote.js'
import { useFrozenQuote } from '../hooks/useFrozenQuote.js'
import { useResolvedCheckoutRecipient } from '../hooks/useResolvedCheckoutRecipient.js'
import { useOnRampSessionByCategory } from '../providers/OnRampProvider/OnRampProvider.js'
import {
  type CheckoutFundingSource,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import {
  checkoutAbsolutePaths,
  checkoutNavigationRoutes,
} from '../utils/navigationRoutes.js'

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
  const onRampSession = useOnRampSessionByCategory(
    fundingSource === 'cash' || fundingSource === 'exchange'
      ? fundingSource
      : null
  )

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
    freeze(route)
    setFrozenRouteId(route.id)
    const cryptoAmount = formatTokenAmount(
      BigInt(route.fromAmount),
      route.fromToken.decimals
    )
    const priceUSD = Number.parseFloat(route.fromToken.priceUSD ?? '')
    const cryptoAmountNumber = Number.parseFloat(cryptoAmount)
    const fiatAmount =
      Number.isFinite(priceUSD) &&
      priceUSD > 0 &&
      Number.isFinite(cryptoAmountNumber) &&
      cryptoAmountNumber > 0
        ? (cryptoAmountNumber * priceUSD).toFixed(2)
        : undefined
    onRampSession.open({
      depositAddress,
      amount: cryptoAmount,
      fiatCurrency,
      fiatAmount,
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

  // Only the wallet flow may connect-on-demand; other sources fund without a wallet.
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

  // A failed step leaves no deposit address, so the CTA can never enable.
  if (isError) {
    return (
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => refetch()}
        sx={{ flex: 1 }}
      >
        {t('button.tryAgain')}
      </Button>
    )
  }

  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={handlersByFunding[fundingSource]}
      disabled={!route || !depositAddress || needsRecipient}
      sx={{ flex: 1 }}
    >
      {label}
    </Button>
  )
}
