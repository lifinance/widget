import { useTranslation } from 'react-i18next'
import type { NavigationTabKey } from '../../types/widget.js'

export const useNavigationTabLabel = (): ((
  key: NavigationTabKey
) => string) => {
  const { t } = useTranslation()
  return (key: NavigationTabKey) => {
    switch (key) {
      case 'default':
        return t('header.swapAndBridge')
      case 'private':
        return t('header.private')
      case 'refuel':
        return t('header.gas')
      case 'swap':
      case 'swap-advanced':
        return t('header.swap')
      case 'bridge':
      case 'bridge-advanced':
        return t('header.bridge')
      case 'limit':
        return t('header.limit')
      default:
        return t('header.swapAndBridge')
    }
  }
}
