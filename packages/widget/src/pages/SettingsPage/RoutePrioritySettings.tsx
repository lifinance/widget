import { Orders } from '@lifi/sdk';
import RouteIcon from '@mui/icons-material/Route';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '../../components/Tabs';
import { useSettingMonitor } from '../../hooks';
import { useSettings, useSettingsStore } from '../../stores';
import { BadgedValue, SettingCardExpandable } from './SettingsCard';

type SupportedRoute = (typeof Orders)[number];

export const RoutePrioritySettings: React.FC = () => {
  const { t } = useTranslation();
  const setValue = useSettingsStore((state) => state.setValue);
  const { isRoutePriorityChanged } = useSettingMonitor();
  const { routePriority } = useSettings(['routePriority']);
  const currentRoutePriority = routePriority ?? '';

  const handleRoutePriorityChange = (
    _: React.SyntheticEvent,
    routePriority: SupportedRoute,
  ) => {
    setValue('routePriority', routePriority);
  };

  return (
    <SettingCardExpandable
      value={
        <BadgedValue badgeColor="info" showBadge={isRoutePriorityChanged}>
          {t(`main.tags.${currentRoutePriority.toLowerCase()}` as any)}
        </BadgedValue>
      }
      icon={<RouteIcon />}
      title={t(`settings.routePriority`)}
    >
      <Tabs
        value={currentRoutePriority}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleRoutePriorityChange}
        orientation="vertical"
        sx={{ mt: 1.5 }}
      >
        {Orders.map((order) => {
          return (
            <Tab
              key={order}
              label={t(`main.tags.${order.toLowerCase()}` as any)}
              value={order}
              disableRipple
            />
          );
        })}
      </Tabs>
    </SettingCardExpandable>
  );
};
