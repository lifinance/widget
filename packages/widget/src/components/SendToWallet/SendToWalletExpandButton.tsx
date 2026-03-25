import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import Wallet from '@mui/icons-material/Wallet'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  labelWrapperClassName,
  SendToWalletExpandButtonChip,
  SendToWalletExpandButtonIcon,
  SendToWalletExpandButtonLabel,
  SendToWalletExpandButtonLabelWrapper,
} from './SendToWalletExpandButton.style.js'

export const SendToWalletExpandButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { subvariant, subvariantOptions, toAddresses, disabledUI, hiddenUI } =
    useWidgetConfig()
  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress)
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress)
  const { requiredToAddress } = useToAddressRequirements()
  const [toAddressValue] = useFieldValues('toAddress')

  if (
    hiddenToAddress ||
    disabledToAddress ||
    toAddressValue ||
    requiredToAddress
  ) {
    return null
  }

  const label =
    subvariant === 'custom' && subvariantOptions?.custom === 'deposit'
      ? t('header.depositTo')
      : t('header.sendToWallet')

  const handleClick = () =>
    navigate({
      to: toAddresses?.length
        ? navigationRoutes.configuredWallets
        : navigationRoutes.sendToWallet,
    })

  return (
    <SendToWalletExpandButtonChip onClick={handleClick}>
      <SendToWalletExpandButtonIcon>
        <Wallet sx={{ fontSize: 16 }} />
        <SendToWalletExpandButtonLabelWrapper className={labelWrapperClassName}>
          <SendToWalletExpandButtonLabel>{label}</SendToWalletExpandButtonLabel>
        </SendToWalletExpandButtonLabelWrapper>
        <ChevronRightRounded sx={{ fontSize: 16, mr: -0.5 }} />
      </SendToWalletExpandButtonIcon>
    </SendToWalletExpandButtonChip>
  )
}
