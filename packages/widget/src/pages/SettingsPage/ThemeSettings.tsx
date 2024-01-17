import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '../../components/Tabs';
import { CardValue } from '../../components/Card';
import { useWidgetConfig } from '../../providers';
import { useAppearance } from '../../stores';
import type { Appearance } from '../../types';
import { HiddenUI } from '../../types';
import { SettingCardExpandable } from './SettingsCard';

const themeIcons = {
  light: LightModeIcon,
  dark: NightlightIcon,
  auto: BrightnessAutoIcon,
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
    <Tab icon={Icon} value={value} {...props} disableRipple />
  </Tooltip>
);

export const ThemeSettings: React.FC = () => {
  const { t } = useTranslation();
  const [appearance, setAppearance] = useAppearance();
  const { hiddenUI } = useWidgetConfig();

  if (hiddenUI?.includes(HiddenUI.Appearance)) {
    return null;
  }

  const ThemeIcon = themeIcons[appearance];

  const handleThemeChange = (
    _: React.SyntheticEvent,
    appearance: Appearance,
  ) => {
    setAppearance(appearance);
  };

  return (
    <SettingCardExpandable
      value={<CardValue>{t(`button.${appearance}`)} </CardValue>}
      icon={<ThemeIcon />}
      title={t('settings.theme')}
    >
      <Tabs
        value={appearance}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleThemeChange}
        sx={{ mt: 1.5 }}
      >
        {Object.entries(themeIcons).map(([theme, Icon]) => {
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
    </SettingCardExpandable>
  );
};
