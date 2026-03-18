import Wallet from '@mui/icons-material/Wallet'
import { Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { ButtonChip } from '../ButtonChip/ButtonChip.js'

export const AmountInputHeaderBadge: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { subvariant, subvariantOptions, toAddresses, disabledUI, hiddenUI } =
    useWidgetConfig()
  const [toAddress] = useFieldValues('toAddress')

  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress)
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress)
  const showWalletBadge = !hiddenToAddress && !(disabledToAddress && !toAddress)

  if (!showWalletBadge) {
    return null
  }

  const label =
    subvariant === 'custom' && subvariantOptions?.custom === 'deposit'
      ? t('header.depositTo')
      : t('header.sendToWallet')

  const handleClick = disabledToAddress
    ? undefined
    : () =>
        navigate({
          to: toAddresses?.length
            ? navigationRoutes.configuredWallets
            : navigationRoutes.sendToWallet,
        })

  return (
    <ButtonChip
      onClick={handleClick}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
    >
      <Wallet sx={{ width: 16, height: 16 }} />
      <Typography sx={{ fontSize: 12, lineHeight: 1, fontWeight: 700 }}>
        {toAddress ? shortenAddress(toAddress) : label}
      </Typography>
    </ButtonChip>
  )
}
