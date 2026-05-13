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
  wallet: 'button.deposit',
  transfer: 'button.transferCrypto',
  exchange: 'button.connectExchange',
  cash: 'button.depositWithCash',
} as const satisfies Record<CheckoutFundingSource, string>

const statusPath = `/${checkoutNavigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`

export const CheckoutFlowCtaButton: React.FC = (): JSX.Element => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const emitter = useWidgetEvents()
  const { toAddress, requiredToAddress } = useToAddressRequirements()
  const { route, routes, depositAddress, setReviewableRoute } =
    useCheckoutFlowQuote()
  const { freeze } = useFrozenQuote()
  const fundingSource = useCheckoutFlowStore((s) => s.fundingSource) ?? 'wallet'
  const setFrozenRouteId = useCheckoutFlowStore((s) => s.setFrozenRouteId)
  const fiatCurrency = useFiatCurrencyStore((s) => s.currency)
  const [fromAmount] = useFieldValues('fromAmount')
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
    onRampSession.open({
      depositAddress,
      amount: String(fromAmount ?? ''),
      fiatCurrency,
    })
    navigate({
      to: statusPath,
      search:
        process.env.NODE_ENV !== 'production'
          ? { simulateTransactionStatus: 'watching' }
          : {},
    })
  }, [
    route,
    depositAddress,
    onRampSession,
    freeze,
    setFrozenRouteId,
    fromAmount,
    fiatCurrency,
    navigate,
  ])

  const handlersByFunding: Record<CheckoutFundingSource, () => void> = {
    wallet: handleWalletDeposit,
    transfer: handleTransferDeposit,
    exchange: handleOnRampDeposit,
    cash: handleOnRampDeposit,
  }

  const disabled =
    fundingSource === 'wallet'
      ? !route || (requiredToAddress && !toAddress)
      : !route || !depositAddress

  return (
    <BaseTransactionButton
      text={t(ctaLabelKey[fundingSource])}
      onClick={handlersByFunding[fundingSource]}
      disabled={disabled}
      route={route}
      sx={{ flex: 1 }}
    />
  )
}
