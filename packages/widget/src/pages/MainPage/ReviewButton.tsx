import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BaseTransactionButton } from '../../components/BaseTransactionButton/BaseTransactionButton.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useSplitMode } from '../../stores/navigationTabs/useNavigationTabsStore.js'
import { WidgetEvent } from '../../types/events.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const ReviewButton: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const emitter = useWidgetEvents()
  const { mode, modeOptions } = useWidgetConfig()
  const splitState = useSplitMode()
  const { toAddress, requiredToAddress } = useToAddressRequirements()
  const { routes, setReviewableRoute } = useRoutes()
  const [selectedRouteId] = useFieldValues('selectedRouteId')

  // The provider pick only applies in limit mode (it's the only flow that sets
  // it). Honoring it in other modes would be wrong, since provider/tool keys
  // can collide across modes. Everywhere else, fall back to the best route.
  const currentRoute =
    (mode === 'limit'
      ? routes?.find((route) => route.id === selectedRouteId)
      : undefined) ?? routes?.[0]

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
      switch (mode) {
        case 'custom':
          return t(`button.${modeOptions?.custom?.type ?? 'checkout'}Review`)
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
    switch (mode) {
      case 'custom':
        return modeOptions?.custom?.type === 'deposit'
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
      sx={{ flex: 1 }}
    />
  )
}
