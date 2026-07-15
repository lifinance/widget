import { useTranslation } from 'react-i18next'
import { ConfirmationBottomSheet } from './ConfirmationBottomSheet.js'

interface CloseConfirmationDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  container?: HTMLElement | null
}

const titleId = 'checkout-close-confirmation-title'
const bodyId = 'checkout-close-confirmation-body'

export const CloseConfirmationDialog: React.FC<
  CloseConfirmationDialogProps
> = ({ open, onCancel, onConfirm, container }) => {
  const { t } = useTranslation()
  return (
    <ConfirmationBottomSheet
      open={open}
      onCancel={onCancel}
      onConfirm={onConfirm}
      container={container}
      titleId={titleId}
      bodyId={bodyId}
      title={t('checkout.closeConfirmation.title')}
      body={t('checkout.closeConfirmation.body')}
      cancelLabel={t('checkout.closeConfirmation.cancel')}
      confirmLabel={t('checkout.closeConfirmation.confirm')}
    />
  )
}
