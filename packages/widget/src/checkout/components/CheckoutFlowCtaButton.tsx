import { useNavigate } from '@tanstack/react-router'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { WidgetEvent } from '../../types/events.js'
import { useCheckoutFlowQuote } from '../hooks/useCheckoutFlowQuote.js'
import { useFrozenQuote } from '../hooks/useFrozenQuote.js'
import { useOnRamp } from '../hooks/useOnRamp.js'
import {
  type CheckoutFundingSource,
  useCheckoutFlowStore,
} from '../stores/useCheckoutFlowStore.js'
import { useFiatCurrencyStore } from '../stores/useFiatCurrencyStore.js'
import {
  checkoutAbsolutePaths,
  checkoutNavigationRoutes,
} from '../utils/navigationRoutes.js'

function ctaLabel(
  t: ReturnType<typeof useTranslation>['t'],
  flow: CheckoutFundingSource
): string {
  switch (flow) {
    case 'wallet':
      return t('button.deposit')
    case 'transfer':
      return t('button.transferCrypto')
    case 'exchange':
      return t('button.connectExchange')
    case 'cash':
      return t('button.depositWithCash')
  }
}

export const CheckoutFlowCtaButton: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const emitter = useWidgetEvents()
  const { toAddress, requiredToAddress } = useToAddressRequirements()
  const { route, routes, depositAddress, setReviewableRoute } =
    useCheckoutFlowQuote()
  const { freeze } = useFrozenQuote()
  const { getProvider } = useOnRamp()
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource)
  const setFrozenRouteId = useCheckoutFlowStore((s) => s.setFrozenRouteId)
  const fiatCurrency = useFiatCurrencyStore((s) => s.currency)
  const [fromAmount] = useFieldValues('fromAmount')

  const flow: CheckoutFundingSource = fundingSource ?? 'wallet'

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

  const handleNonWalletCta = useCallback(() => {
    if (!route || !depositAddress) {
      return
    }
    freeze(route)
    setFrozenRouteId(route.id)
    const amount = String(fromAmount ?? '')

    if (flow === 'transfer') {
      navigate({ to: checkoutNavigationRoutes.transferDeposit })
      return
    }
    if (flow === 'exchange') {
      getProvider('mesh')?.openDepositFlow({ depositAddress, amount })
    } else if (flow === 'cash') {
      getProvider('transak')?.openDepositFlow({
        depositAddress,
        amount,
        fiatCurrency,
      })
    }
    navigate({
      to: `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`,
      search: { simulateTransactionStatus: 'watching' },
    })
  }, [
    route,
    depositAddress,
    flow,
    freeze,
    setFrozenRouteId,
    fromAmount,
    fiatCurrency,
    getProvider,
    navigate,
  ])

  const handleClick =
    flow === 'wallet' ? handleWalletDeposit : handleNonWalletCta

  const disabled =
    flow === 'wallet'
      ? !route || (requiredToAddress && !toAddress)
      : !route || !depositAddress

  return (
    <BaseTransactionButton
      text={ctaLabel(t, flow)}
      onClick={handleClick}
      disabled={disabled}
      route={route}
      sx={{ flex: 1 }}
    />
  )
}
