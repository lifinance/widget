import { useTranslation } from 'react-i18next'
import { ConfirmationBottomSheet } from './ConfirmationBottomSheet.js'

interface AbandonConfirmationDialogProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
  container?: HTMLElement | null
}

const titleId = 'checkout-abandon-confirmation-title'
const bodyId = 'checkout-abandon-confirmation-body'

export const AbandonConfirmationDialog: React.FC<
  AbandonConfirmationDialogProps
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
      title={t('checkout.abandonConfirmation.title')}
      body={t('checkout.abandonConfirmation.body')}
      cancelLabel={t('checkout.abandonConfirmation.cancel')}
      confirmLabel={t('checkout.abandonConfirmation.confirm')}
    />
  )
}
