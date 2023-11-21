import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigateBack } from '../../hooks';
import { navigationRoutes } from '../../utils';
import { SettingsBadge, SettingsIconButton } from './SettingsButon.style.';

export const SettingsButton = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigateBack();

  const notification = 'info'; // = 'warning'; //= 'info';

  return (
    <Tooltip title={t(`header.settings`)} enterDelay={400} arrow>
      <SettingsIconButton
        size="medium"
        onClick={() => navigate(navigationRoutes.settings)}
        notification={notification}
      >
        <SettingsBadge variant="dot" color={notification}>
          <SettingsIcon />
        </SettingsBadge>
      </SettingsIconButton>
    </Tooltip>
  );
};
