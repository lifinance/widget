import type { Appearance } from '../../types';
import { HiddenUI } from '../../types';
import { useWidgetConfig } from '../../providers';
import LightModeIcon from '@mui/icons-material/LightMode';
import BrightnessAuto from '@mui/icons-material/BrightnessAuto';
import Nightlight from '@mui/icons-material/Nightlight';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppearance } from '../../stores';
import {
  SettingCardExpandable,
  SettingSummaryText,
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
  const { hiddenUI } = useWidgetConfig();

  if (hiddenUI?.includes(HiddenUI.Appearance)) {
    return null;
  }

  const ThemeIcon = themeIconLookUp[appearance];

  const handleThemeChange = (
    _: React.SyntheticEvent,
    appearance: Appearance,
  ) => {
    setAppearance(appearance);
  };

  return (
    <SettingCardExpandable
      additionalInfo={
        <SettingSummaryText>{t(`button.${appearance}`)} </SettingSummaryText>
      }
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
    </SettingCardExpandable>
  );
};
