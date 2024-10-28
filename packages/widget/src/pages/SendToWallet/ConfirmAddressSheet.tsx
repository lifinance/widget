import { Info, Wallet } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import type { MutableRefObject } from 'react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertMessage } from '../../components/AlertMessage/AlertMessage.js'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import type { Bookmark } from '../../stores/bookmarks/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useSendToWalletActions } from '../../stores/settings/useSendToWalletStore.js'
import {
  IconContainer,
  SendToWalletButtonRow,
  SendToWalletSheetContainer,
  SheetAddressContainer,
  SheetTitle,
} from './SendToWalletPage.style.js'

interface ConfirmAddressSheetProps {
  onConfirm: (wallet: Bookmark) => void
  validatedBookmark?: Bookmark
}

export const ConfirmAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmAddressSheetProps
>(({ validatedBookmark, onConfirm }, ref) => {
  const { t } = useTranslation()
  const { navigateBack } = useNavigateBack()
  const { setFieldValue } = useFieldActions()
  const { setSendToWallet } = useSendToWalletActions()

  const handleClose = () => {
    ;(ref as MutableRefObject<BottomSheetBase>).current?.close()
  }

  const handleConfirm = () => {
    if (validatedBookmark) {
      setFieldValue('toAddress', validatedBookmark.address, {
        isTouched: true,
        isDirty: true,
      })
      onConfirm?.(validatedBookmark)
      setSendToWallet(true)
      handleClose()
      navigateBack()
    }
  }

  return (
    <BottomSheet ref={ref}>
      <SendToWalletSheetContainer>
        <IconContainer>
          <Wallet sx={{ fontSize: 40 }} />
        </IconContainer>
        <SheetTitle>{t('sendToWallet.confirmWalletAddress')}</SheetTitle>
        <SheetAddressContainer>
          {validatedBookmark?.name ? (
            <Typography fontWeight={600} mb={0.5}>
              {validatedBookmark?.name}
            </Typography>
          ) : null}
          <Typography>{validatedBookmark?.address}</Typography>
        </SheetAddressContainer>
        <AlertMessage
          title={
            <Typography variant="body2">
              {t('info.message.fundsToExchange')}
            </Typography>
          }
          icon={<Info />}
        />
        <SendToWalletButtonRow>
          <Button variant="text" onClick={handleClose} fullWidth>
            {t('button.cancel')}
          </Button>
          <Button variant="contained" onClick={handleConfirm} fullWidth>
            {t('button.confirm')}
          </Button>
        </SendToWalletButtonRow>
      </SendToWalletSheetContainer>
    </BottomSheet>
  )
})
