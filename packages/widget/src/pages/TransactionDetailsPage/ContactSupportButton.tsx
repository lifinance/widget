import { useTranslation } from 'react-i18next'
import { ButtonChip } from '../../components/ButtonChip/ButtonChip.js'
import { useContactSupport } from '../../hooks/useContactSupport.js'

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
