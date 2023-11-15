import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse } from '@mui/material';
import RouteIcon from '@mui/icons-material/Route';
import { Orders } from '@lifi/sdk';
import { Tab, Tabs } from '../../components/Tabs';
import { useSettings, useSettingsStore } from '../../stores';
import {
  SettingCard,
  SettingTitle,
  SettingSummaryButton,
  SettingSummaryText,
} from './SettingsPage.style';

type SupportedRoute = (typeof Orders)[number];

export const RoutePrioritySettings: React.FC = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const setValue = useSettingsStore((state) => state.setValue);
  const { routePriority } = useSettings(['routePriority']);
  const currentRoutePriority = routePriority ?? '';

  const toggleExpanded = () => {
    setExpanded((currentExpanded) => !currentExpanded);
  };

  const handleRoutePriorityChange = (
    _: React.SyntheticEvent,
    routePriority: SupportedRoute,
  ) => {
    setValue('routePriority', routePriority);
  };

  return (
    <SettingCard>
      <SettingSummaryButton onClick={toggleExpanded} focusRipple>
        <SettingTitle>
          <RouteIcon />
          <SettingSummaryText>{t(`settings.routePriority`)}</SettingSummaryText>
        </SettingTitle>
        {!expanded && (
          <SettingSummaryText>
            {t(`main.tags.${currentRoutePriority.toLowerCase()}` as any)}
          </SettingSummaryText>
        )}
      </SettingSummaryButton>
      <Collapse in={expanded}>
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
      </Collapse>
    </SettingCard>
  );
};
