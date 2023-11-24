import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigateBack, useSettingMonitor } from '../../hooks';
import { navigationRoutes } from '../../utils';
import { SettingsIconButton } from './SettingsButton.style';
import { Badge } from '../../components/Badge';

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

  return (
    <Tooltip title={t(`header.settings`)} enterDelay={400} arrow>
      <SettingsIconButton
        size="medium"
        onClick={() => navigate(navigationRoutes.settings)}
        notification={notification}
      >
        {notification ? (
          <Badge variant="dot" color={notification}>
            <SettingsIcon />
          </Badge>
        ) : (
          <SettingsIcon />
        )}
      </SettingsIconButton>
    </Tooltip>
  );
};
