import { useTranslation } from 'react-i18next'
import { CardIconButton } from '../../components/Card/CardIconButton.js'
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
    <CardIconButton
      size="small"
      onClick={handleContactSupport}
      sx={{ fontSize: 12, fontWeight: 700, px: 1 }}
    >
      {t('button.contactSupport')}
    </CardIconButton>
  )
}
