import Wallet from '@mui/icons-material/Wallet'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const SendToWalletExpandButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toAddresses, disabledUI, hiddenUI } = useWidgetConfig()
  const hiddenToAddress = hiddenUI?.includes(HiddenUI.ToAddress)
  const disabledToAddress = disabledUI?.includes(DisabledUI.ToAddress)
  const { requiredToAddress } = useToAddressRequirements()
  const [toAddressValue] = useFieldValues('toAddress')

  const visible =
    !hiddenToAddress &&
    !disabledToAddress &&
    !toAddressValue &&
    !requiredToAddress

  const handleClick = () =>
    navigate({
      to: toAddresses?.length
        ? navigationRoutes.configuredWallets
        : navigationRoutes.sendToWallet,
    })

  return (
    <Collapse
      orientation="horizontal"
      in={visible}
      timeout={225}
      mountOnEnter
      unmountOnExit
    >
      <Tooltip title={t('main.sendToWallet')} placement="bottom-end">
        <Button
          variant="text"
          onClick={handleClick}
          sx={{
            ml: 1.5,
            minWidth: 48,
            width: 48,
            height: 48,
          }}
        >
          <Wallet />
        </Button>
      </Tooltip>
    </Collapse>
  )
}
