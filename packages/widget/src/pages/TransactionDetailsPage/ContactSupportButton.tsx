import { useTranslation } from 'react-i18next'
import { CardIconButton } from '../../components/Card/CardIconButton.js'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { WidgetEvent } from '../../types/events.js'

interface ContactSupportButtonProps {
  supportId?: string
}

export const ContactSupportButton = ({
  supportId,
}: ContactSupportButtonProps) => {
  const { t } = useTranslation()
  const widgetEvents = useWidgetEvents()

  const handleClick = () => {
    if (!widgetEvents.all.has(WidgetEvent.ContactSupport)) {
      const url = 'https://help.li.fi'
      const target = '_blank'
      const rel = 'nofollow noreferrer'
      window.open(url, target, rel)
    } else {
      widgetEvents.emit(WidgetEvent.ContactSupport, { supportId })
    }
  }

  return (
    <CardIconButton
      size="small"
      onClick={handleClick}
      sx={{ fontSize: 12, fontWeight: 700, px: 1 }}
    >
      {t('button.contactSupport')}
    </CardIconButton>
  )
}
