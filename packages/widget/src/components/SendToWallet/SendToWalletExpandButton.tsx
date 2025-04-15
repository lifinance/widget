import Wallet from '@mui/icons-material/Wallet'
import { Button, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { useSendToWalletStore } from '../../stores/settings/useSendToWalletStore.js'
import { WidgetEvent } from '../../types/events.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'

export const SendToWalletExpandButton: React.FC = () => {
  const { t } = useTranslation()
  const { disabledUI, hiddenUI } = useWidgetConfig()
  const { setFieldValue } = useFieldActions()
  const { setSelectedBookmark } = useBookmarkActions()
  const emitter = useWidgetEvents()
  const { showSendToWallet, setSendToWallet } = useSendToWalletStore()
  const [toAddressFieldValue] = useFieldValues('toAddress')
  const { requiredToAddress } = useToAddressRequirements()

  if (requiredToAddress || hiddenUI?.includes(HiddenUI.ToAddress)) {
    return null
  }

  const handleClick = () => {
    if (showSendToWallet && !disabledUI?.includes(DisabledUI.ToAddress)) {
      setFieldValue('toAddress', '', { isTouched: true })
      setSelectedBookmark()
    }
    setSendToWallet(!showSendToWallet)
    emitter.emit(
      WidgetEvent.SendToWalletToggled,
      useSendToWalletStore.getState().showSendToWallet
    )
  }

  const buttonVariant =
    showSendToWallet || Boolean(toAddressFieldValue) ? 'contained' : 'text'

  return (
    <Tooltip title={t('main.sendToWallet')} placement="bottom-end">
      <Button
        variant={buttonVariant}
        onClick={handleClick}
        sx={{
          minWidth: 48,
          width: 48,
          height: 48,
        }}
      >
        <Wallet />
      </Button>
    </Tooltip>
  )
}
