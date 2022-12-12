import {
  Brightness4 as Brightness4Icon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { Box, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../../providers';
import { useAppearance } from '../../stores';
import { HiddenUI } from '../../types';
import { ToggleButton } from './ColorSchemeButtonGroup.style';

export const ColorSchemeButtonGroup: React.FC = () => {
  const { t } = useTranslation();
  const { disableAppearance, hiddenUI } = useWidgetConfig();
  const [appearance, setAppearance] = useAppearance();

  if (disableAppearance || hiddenUI?.includes(HiddenUI.Appearance)) {
    return null;
  }

  return (
    <Box pb={2}>
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
        <ToggleButton value="auto">
          <Brightness4Icon sx={{ marginRight: 1 }} />
          {t('button.auto')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
