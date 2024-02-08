import { Settings } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigateBack } from '../../hooks/useNavigateBack.js';
import { useSettingMonitor } from '../../hooks/useSettingMonitor.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import {
  SettingsIconBadge,
  SettingsIconButton,
} from './SettingsButton.style.js';

export const SettingsButton = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigateBack();

  const { isCustomRouteSettings, isRouteSettingsWithWarnings } =
    useSettingMonitor();

  const variant = isRouteSettingsWithWarnings
    ? 'warning'
    : isCustomRouteSettings
      ? 'info'
      : undefined;

  const tooltipMessage = variant
    ? t(`tooltip.settingsModified`)
    : t(`header.settings`);

  return (
    <Tooltip title={tooltipMessage} enterDelay={400} arrow>
      <SettingsIconButton
        size="medium"
        onClick={() => navigate(navigationRoutes.settings)}
        variant={variant}
      >
        {variant ? (
          <SettingsIconBadge variant="dot" color={variant}>
            <Settings />
          </SettingsIconBadge>
        ) : (
          <Settings />
        )}
      </SettingsIconButton>
    </Tooltip>
  );
};
