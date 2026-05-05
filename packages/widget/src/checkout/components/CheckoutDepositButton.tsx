import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { WidgetEvent } from '../../types/events.js'
import { checkoutAbsolutePaths } from '../utils/navigationRoutes.js'

/**
 * Checkout deposit CTA — always labeled “Deposit” and forwards directly to execution
 * (no separate “review” step; aligned with Figma checkout).
 */
export const CheckoutDepositButton: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const emitter = useWidgetEvents()
  const { toAddress, requiredToAddress } = useToAddressRequirements()
  const { routes, setReviewableRoute } = useRoutes()

  const currentRoute = routes?.[0]

  const handleClick = () => {
    if (!currentRoute) {
      return
    }

    setReviewableRoute(currentRoute)
    navigate({
      to: checkoutAbsolutePaths.transactionExecution,
      search: { routeId: currentRoute.id, checkoutAutoDeposit: true },
    })
    emitter.emit(WidgetEvent.RouteSelected, {
      route: currentRoute,
      routes: routes!,
    })
  }

  return (
    <BaseTransactionButton
      text={t('button.deposit')}
      onClick={handleClick}
      disabled={!currentRoute || (requiredToAddress && !toAddress)}
      route={currentRoute}
      sx={{ flex: 1 }}
    />
  )
}
