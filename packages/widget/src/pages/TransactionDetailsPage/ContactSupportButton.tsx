import { useTranslation } from 'react-i18next'
import { useContactSupport } from '../../hooks/useContactSupport.js'
import { ButtonChip } from './ContactSupportButton.style.js'

interface ContactSupportButtonProps {
  supportId?: string
}

export const ContactSupportButton = ({
  supportId,
}: ContactSupportButtonProps) => {
  const { t } = useTranslation()
  const handleContactSupport = useContactSupport(supportId)

  return (
    <ButtonChip onClick={handleContactSupport}>
      {t('button.contactSupport')}
    </ButtonChip>
  )
}
