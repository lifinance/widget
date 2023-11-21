import { useTranslation } from 'react-i18next';
import RouteIcon from '@mui/icons-material/Route';
import { Orders } from '@lifi/sdk';
import { Tab, Tabs } from '../../components/Tabs';
import { useSettings, useSettingsStore } from '../../stores';
import {
  SettingCardExpandable,
  SettingSummaryText,
} from './SettingsPage.style';

type SupportedRoute = (typeof Orders)[number];

export const RoutePrioritySettings: React.FC = () => {
  const { t } = useTranslation();
  const setValue = useSettingsStore((state) => state.setValue);
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
      additionalInfo={
        <SettingSummaryText>
          {t(`main.tags.${currentRoutePriority.toLowerCase()}` as any)}
        </SettingSummaryText>
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
              label={t(`main.tags.${order.toLowerCase()}` as any)}
              value={order}
            />
          );
        })}
      </Tabs>
    </SettingCardExpandable>
  );
};
