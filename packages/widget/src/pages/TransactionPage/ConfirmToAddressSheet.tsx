import Wallet from '@mui/icons-material/Wallet'
import WarningRounded from '@mui/icons-material/WarningRounded'
import { Button, Typography } from '@mui/material'
import type { RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet'
import type { BottomSheetBase } from '../../components/BottomSheet/types'
import { AlertMessage } from '../../components/Messages/AlertMessage'
import { useChain } from '../../hooks/useChain'
import { useSetContentHeight } from '../../hooks/useSetContentHeight'
import { useWidgetEvents } from '../../hooks/useWidgetEvents'
import { WidgetEvent } from '../../types/events'
import {
  IconContainer,
  SendToWalletButtonRow,
  SendToWalletSheetContainer,
  SheetAddressContainer,
} from '../SendToWallet/SendToWalletPage.style'

interface ConfirmToAddressSheetProps {
  onContinue: () => void
  toAddress: string
  toChainId: number
}

interface ConfirmToAddressSheetContentProps extends ConfirmToAddressSheetProps {
  onClose: () => void
}

export const ConfirmToAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmToAddressSheetProps
>((props, ref) => {
  const handleClose = () => {
    ;(ref as RefObject<BottomSheetBase>).current?.close()
  }

  return (
    <BottomSheet ref={ref}>
      <ConfirmToAddressSheetContent {...props} onClose={handleClose} />
    </BottomSheet>
  )
})

const ConfirmToAddressSheetContent: React.FC<
  ConfirmToAddressSheetContentProps
> = ({ onContinue, onClose, toAddress, toChainId }) => {
  const { t } = useTranslation()
  const { chain } = useChain(toChainId)
  const emitter = useWidgetEvents()
  const ref = useRef<HTMLElement>(null)
  useSetContentHeight(ref)

  const handleContinue = () => {
    emitter.emit(WidgetEvent.LowAddressActivityConfirmed, {
      address: toAddress,
      chainId: toChainId,
    })
    onClose()
    onContinue()
  }

  return (
    <SendToWalletSheetContainer ref={ref}>
      <IconContainer>
        <Wallet sx={{ fontSize: 40 }} />
      </IconContainer>
      <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
        {t('warning.title.lowAddressActivity')}
      </Typography>
      <SheetAddressContainer>
        <Typography>{toAddress}</Typography>
      </SheetAddressContainer>
      <AlertMessage
        severity="warning"
        title={
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {t('warning.message.lowAddressActivity', {
              chainName: chain?.name,
            })}
          </Typography>
        }
        icon={<WarningRounded />}
        multiline
      />
      <SendToWalletButtonRow>
        <Button variant="text" onClick={onClose} fullWidth>
          {t('button.cancel')}
        </Button>
        <Button variant="contained" onClick={handleContinue} fullWidth>
          {t('button.continue')}
        </Button>
      </SendToWalletButtonRow>
    </SendToWalletSheetContainer>
  )
}
