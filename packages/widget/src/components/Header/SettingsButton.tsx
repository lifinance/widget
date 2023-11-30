import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigateBack, useSettingMonitor } from '../../hooks';
import { navigationRoutes } from '../../utils';
import { SettingsIconBadge, SettingsIconButton } from './SettingsButton.style';

export const SettingsButton = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigateBack();

  const { isCustomRouteSettings, isRouteSettingsWithWarnings } =
    useSettingMonitor();

  const notification = isRouteSettingsWithWarnings
    ? 'warning'
    : isCustomRouteSettings
      ? 'info'
      : undefined;

  const tooltipMessage = notification
    ? t(`tooltip.settingsModified`)
    : t(`header.settings`);

  return (
    <Tooltip title={tooltipMessage} enterDelay={400} arrow>
      <SettingsIconButton
        size="medium"
        onClick={() => navigate(navigationRoutes.settings)}
        notification={notification}
      >
        {notification ? (
          <SettingsIconBadge variant="dot" color={notification}>
            <SettingsIcon />
          </SettingsIconBadge>
        ) : (
          <SettingsIcon />
        )}
      </SettingsIconButton>
    </Tooltip>
  );
};
