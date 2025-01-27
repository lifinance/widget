import { Info, Wallet, Warning } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import type { MutableRefObject } from 'react'
import { forwardRef, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertMessage } from '../../components/AlertMessage/AlertMessage.js'
import { BottomSheet } from '../../components/BottomSheet/BottomSheet.js'
import type { BottomSheetBase } from '../../components/BottomSheet/types.js'
import { useIsContractAddress } from '../../hooks/useIsContractAddress.js'
import { useNavigateBack } from '../../hooks/useNavigateBack.js'
import { useSetContentHeight } from '../../hooks/useSetContentHeight.js'
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
  chainId?: number
}

interface ConfirmAddressSheetContentProps extends ConfirmAddressSheetProps {
  onClose: () => void
}

export const ConfirmAddressSheet = forwardRef<
  BottomSheetBase,
  ConfirmAddressSheetProps
>((props, ref) => {
  const handleClose = () => {
    ;(ref as MutableRefObject<BottomSheetBase>).current?.close()
  }

  return (
    <BottomSheet ref={ref}>
      <ConfirmAddressSheetContent {...props} onClose={handleClose} />
    </BottomSheet>
  )
})

const ConfirmAddressSheetContent: React.FC<ConfirmAddressSheetContentProps> = ({
  validatedBookmark,
  onConfirm,
  chainId,
  onClose,
}) => {
  const { t } = useTranslation()
  const { navigateBack } = useNavigateBack()
  const { setFieldValue } = useFieldActions()
  const { setSendToWallet } = useSendToWalletActions()
  const isContractAddress = useIsContractAddress(
    validatedBookmark?.address,
    chainId,
    validatedBookmark?.chainType
  )

  const containerRef = useRef<HTMLElement>(null)
  useSetContentHeight(containerRef, isContractAddress)

  const handleConfirm = () => {
    if (validatedBookmark) {
      setFieldValue('toAddress', validatedBookmark.address, {
        isTouched: true,
        isDirty: true,
      })
      onConfirm?.(validatedBookmark)
      setSendToWallet(true)
      onClose()
      navigateBack()
    }
  }

  return (
    <SendToWalletSheetContainer ref={containerRef}>
      <IconContainer>
        <Wallet sx={{ fontSize: 40 }} />
      </IconContainer>
      <SheetTitle>{t('sendToWallet.confirmWalletAddress')}</SheetTitle>
      <SheetAddressContainer>
        {validatedBookmark?.name ? (
          <Typography
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {validatedBookmark?.name}
          </Typography>
        ) : null}
        <Typography>{validatedBookmark?.address}</Typography>
      </SheetAddressContainer>
      <AlertMessage
        title={
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {t('info.message.fundsToExchange')}
            </Typography>
          </Box>
        }
        icon={<Info />}
        multiline
      />
      {isContractAddress ? (
        <AlertMessage
          title={
            <Typography variant="body2" fontWeight={500}>
              {t('info.message.smartContractAccount')}
            </Typography>
          }
          icon={<Warning />}
          severity="warning"
          multiline
        />
      ) : null}
      <SendToWalletButtonRow>
        <Button variant="text" onClick={onClose} fullWidth>
          {t('button.cancel')}
        </Button>
        <Button variant="contained" onClick={handleConfirm} fullWidth>
          {t('button.confirm')}
        </Button>
      </SendToWalletButtonRow>
    </SendToWalletSheetContainer>
  )
}
