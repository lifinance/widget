import { Orders } from '@lifi/sdk';
import { Route } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '../../components/Tabs/Tabs.style.js';
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js';
import { useSettings } from '../../stores/settings/useSettings.js';
import { useSettingsStore } from '../../stores/settings/useSettingsStore.js';
import { BadgedValue } from './SettingsCard/BadgedValue.js';
import { SettingCardExpandable } from './SettingsCard/SettingCardExpandable.js';

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
      icon={<Route />}
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
