import {
  Brightness4 as Brightness4Icon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppearance } from '../../hooks';
import { ToggleButton } from './ColorSchemeButtonGroup.style';

export const ColorSchemeButtonGroup: React.FC = () => {
  const { t } = useTranslation();
  const [appearance, setAppearance] = useAppearance();

  return (
    <ToggleButtonGroup
      color="primary"
      value={appearance}
      onChange={(_, value) => {
        if (value) {
          setAppearance(value);
        }
      }}
      exclusive
      fullWidth
    >
      <ToggleButton value="light">
        <LightModeIcon sx={{ marginRight: 1 }} />
        {t('button.light')}
      </ToggleButton>
      <ToggleButton value="dark">
        <DarkModeIcon sx={{ marginRight: 1 }} />
        {t('button.dark')}
      </ToggleButton>
      <ToggleButton value="system">
        <Brightness4Icon sx={{ marginRight: 1 }} />
        {t('button.auto')}
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
