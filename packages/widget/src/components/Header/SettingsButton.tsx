import { default as SettingsIcon } from '@mui/icons-material/Settings';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigateBack, useSettingMonitor } from '../../hooks';
import { navigationRoutes } from '../../utils';
import { SettingsIconBadge, SettingsIconButton } from './SettingsButton.style';

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
            <SettingsIcon />
          </SettingsIconBadge>
        ) : (
          <SettingsIcon />
        )}
      </SettingsIconButton>
    </Tooltip>
  );
};
