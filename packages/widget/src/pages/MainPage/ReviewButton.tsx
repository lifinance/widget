import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useSplitSubvariantStore } from '../../stores/settings/useSplitSubvariantStore.js'
import { WidgetEvent } from '../../types/events.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const emitter = useWidgetEvents()
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const splitState = useSplitSubvariantStore((state) => state.state)
  const { toAddress, requiredToAddress } = useToAddressRequirements()
  const { routes, setReviewableRoute } = useRoutes()

  const currentRoute = routes?.[0]

  const handleClick = async () => {
    if (!currentRoute) {
      return
    }

    setReviewableRoute(currentRoute)
    navigate({
      to: navigationRoutes.transactionExecution,
      search: { routeId: currentRoute.id },
    })
    emitter.emit(WidgetEvent.RouteSelected, {
      route: currentRoute,
      routes: routes!,
    })
  }

  const getButtonText = (): string => {
    if (currentRoute) {
      switch (subvariant) {
        case 'custom':
          return t(`button.${subvariantOptions?.custom ?? 'checkout'}Review`)
        case 'refuel':
          return t('button.getGas')
        default: {
          const transactionType =
            currentRoute.fromChainId === currentRoute.toChainId
              ? 'swap'
              : 'bridge'
          return t(`button.${transactionType}Review`)
        }
      }
    }
    switch (subvariant) {
      case 'custom':
        return subvariantOptions?.custom === 'deposit'
          ? t('button.deposit')
          : t('button.buy')
      case 'refuel':
        return t('button.getGas')
      case 'split':
        if (splitState) {
          return t(`button.${splitState}`)
        }
        return t('button.exchange')
      default:
        return t('button.exchange')
    }
  }

  return (
    <BaseTransactionButton
      text={getButtonText()}
      onClick={handleClick}
      disabled={currentRoute && requiredToAddress && !toAddress}
      route={currentRoute}
    />
  )
}
