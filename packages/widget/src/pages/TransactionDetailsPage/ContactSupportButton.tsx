import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWidgetEvents } from '../../hooks/';
import { WidgetEvent } from '../../types/events';

interface ContactSupportButtonProps {
  supportId?: string;
}

export const ContactSupportButton = ({
  supportId,
}: ContactSupportButtonProps) => {
  const { t } = useTranslation();
  const widgetEvents = useWidgetEvents();

  const handleClick = () => {
    if (!widgetEvents.all.has(WidgetEvent.RouteContactSupport)) {
      const url = 'https://discord.gg/lifi';
      const target = '_blank';
      const rel = 'nofollow noreferrer';
      window.open(url, target, rel);
    } else {
      widgetEvents.emit(WidgetEvent.RouteContactSupport, { supportId });
    }
  };

  return (
    <Button onClick={handleClick} fullWidth>
      {t('button.contactSupport')}
    </Button>
  );
};
