import { useTranslation } from 'react-i18next'
import type { JumperTabKey } from './types.js'

export const useJumperTabLabel = (): ((key: JumperTabKey) => string) => {
  const { t } = useTranslation()
  return (key: JumperTabKey) => {
    switch (key) {
      case 'exchange':
        return t('header.swapAndBridge')
      case 'private':
        return t('header.private')
      case 'gas':
        return t('header.gas')
      case 'swap':
        return t('header.swap')
      case 'bridge':
        return t('header.bridge')
      case 'limit':
        return t('header.limit')
    }
  }
}
