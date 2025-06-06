import { useTranslation } from 'react-i18next'
import { WalletTagType } from '../utils/walletTags'

export const useTagLabelByType = () => {
  const { t } = useTranslation()
  return (type: WalletTagType): string => {
    switch (type) {
      case WalletTagType.Multichain:
        return t('tags.multichain')
      case WalletTagType.Installed:
        return t('tags.installed')
      case WalletTagType.QrCode:
        return t('tags.qrCode')
      case WalletTagType.GetStarted:
        return t('tags.getStarted')
      default:
        return ''
    }
  }
}
