import { useAccount } from '@lifi/wallet-management'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { WalletAddressBadge } from '../WalletAddressBadge/WalletAddressBadge.js'

export const AmountInputHeaderBadge: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { subvariant, subvariantOptions, toAddresses, disabledUI, hiddenUI } =
    useWidgetConfig()
  const { account } = useAccount()
  const [toAddress] = useFieldValues('toAddress')

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress)
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress)
  const showWalletBadge =
    !hiddenToAddress &&
    !(disabledToAddress && !toAddress) &&
    account.isConnected

  if (!showWalletBadge) {
    return null
  }

  const handleClick = disabledToAddress
    ? undefined
    : () =>
        navigate({
          to: toAddresses?.length
            ? navigationRoutes.configuredWallets
            : navigationRoutes.sendToWallet,
        })

  return (
    <WalletAddressBadge
      address={toAddress}
      label={
        subvariant === 'custom' && subvariantOptions?.custom === 'deposit'
          ? t('header.depositTo')
          : t('header.sendToWallet')
      }
      onClick={handleClick}
    />
  )
}
