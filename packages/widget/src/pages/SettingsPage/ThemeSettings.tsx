import { useState } from 'react';
import type { Appearance } from '../../types';
import { HiddenUI } from '../../types';
import { useWidgetConfig } from '../../providers';
import LightModeIcon from '@mui/icons-material/LightMode';
import BrightnessAuto from '@mui/icons-material/BrightnessAuto';
import Nightlight from '@mui/icons-material/Nightlight';
import { Collapse, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppearance } from '../../stores';
import {
  SettingCard,
  SettingSummaryText,
  SettingSummaryButton,
  SettingSummary,
} from './SettingsPage.style';
import { Tab, Tabs } from '../../components/Tabs';

const themeIconLookUp = {
  light: LightModeIcon,
  dark: Nightlight,
  auto: BrightnessAuto,
};

interface ThemeTabProps {
  title: string;
  value: Appearance;
  Icon: React.ReactElement;
}

// If the Tab is not the direct child of the Tabs component you can loose the switching
// The component passes the props to the Tab component so switching isn't lost
const ThemeTab: React.FC<ThemeTabProps> = ({
  title,
  value,
  Icon,
  ...props
}) => (
  <Tooltip title={title} arrow>
    <Tab icon={Icon} value={value} {...props} />
  </Tooltip>
);

export const ThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const [appearance, setAppearance] = useAppearance();
  const [expanded, setExpanded] = useState(false);
  const { hiddenUI } = useWidgetConfig();

  if (hiddenUI?.includes(HiddenUI.Appearance)) {
    return null;
  }

  const ThemeIcon = themeIconLookUp[appearance];
  const toggleExpanded = () => {
    setExpanded((currentExpanded) => !currentExpanded);
  };

  const handleThemeChange = (
    _: React.SyntheticEvent,
    appearance: Appearance,
  ) => {
    setAppearance(appearance);
  };

  return (
    <SettingCard>
      <SettingSummary>
        <SettingSummaryButton onClick={toggleExpanded} focusRipple>
          <ThemeIcon />
          <SettingSummaryText>{t('settings.theme')}</SettingSummaryText>
        </SettingSummaryButton>
        {!expanded && (
          <SettingSummaryText>{t(`button.${appearance}`)}</SettingSummaryText>
        )}
      </SettingSummary>
      <Collapse in={expanded}>
        <Tabs
          value={appearance}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={handleThemeChange}
          sx={{ mt: 1.5 }}
        >
          {Object.entries(themeIconLookUp).map(([theme, Icon]) => {
            const supportedThemeOption = theme as Appearance;

            return (
              <ThemeTab
                key={supportedThemeOption}
                title={t(`button.${supportedThemeOption}`)}
                value={supportedThemeOption}
                Icon={<Icon />}
              />
            );
          })}
        </Tabs>
      </Collapse>
    </SettingCard>
  );
};
