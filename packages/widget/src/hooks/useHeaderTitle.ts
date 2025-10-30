import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { RouteExecutionStatus } from '../stores/routes/types.js'
import { navigationRoutes } from '../utils/navigationRoutes.js'
import { useCurrentRoute } from './useCurrentRoute.js'

export function useHeaderTitle(): string {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { subvariant, subvariantOptions } = useWidgetConfig()
  const { route, status } = useCurrentRoute()

  switch (pathname) {
    case navigationRoutes.home: {
      const splitTitle =
        subvariantOptions?.split === 'bridge'
          ? t('header.bridge')
          : subvariantOptions?.split === 'swap'
            ? t('header.swap')
            : undefined
      return subvariant === 'custom'
        ? t(`header.${subvariantOptions?.custom ?? 'checkout'}`)
        : subvariant === 'refuel'
          ? t('header.gas')
          : subvariant === 'split' && splitTitle
            ? splitTitle
            : t('header.exchange')
    }
    case navigationRoutes.activeTransactions:
      return t('header.activeTransactions')
    case navigationRoutes.settings:
      return t('header.settings')
    case navigationRoutes.bridges:
      return t(`settings.enabledBridges`)
    case navigationRoutes.exchanges:
      return t(`settings.enabledExchanges`)
    case navigationRoutes.languages:
      return t('language.title')
    case navigationRoutes.fromChain:
    case navigationRoutes.toChain:
    case `${navigationRoutes.fromToken}${navigationRoutes.fromChain}`:
    case `${navigationRoutes.toToken}${navigationRoutes.toChain}`:
    case navigationRoutes.toTokenNative:
      return t('header.selectChain')
    case navigationRoutes.fromToken:
      return subvariant === 'custom' ? t('header.payWith') : t('header.from')
    case navigationRoutes.toToken:
      return t('header.to')
    case navigationRoutes.routes:
      return t('header.receive')
    case navigationRoutes.transactionExecution: {
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
    case navigationRoutes.transactionDetails:
      return subvariant === 'custom'
        ? t(`header.${subvariantOptions?.custom ?? 'checkout'}Details`)
        : t('header.transactionDetails')
    case navigationRoutes.transactionHistory:
      return t('header.transactionHistory')
    case navigationRoutes.configuredWallets:
    case navigationRoutes.sendToWallet:
      return t('header.sendToWallet')
    case navigationRoutes.bookmarks:
      return t('header.bookmarkedWallets')
    case navigationRoutes.recentWallets:
      return t('header.recentWallets')
    case navigationRoutes.connectedWallets:
      return t('sendToWallet.connectedWallets')
    default:
      return ''
  }
}
