import { darken, styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Badge } from '../Badge';
import { badgeClasses } from '@mui/material/Badge';
import { getInfoBackgroundColor, getWarningBackgroundColor } from '../../utils';

export const SettingsBadge = styled(Badge)({
  [`.${badgeClasses.badge}`]: {
    right: '-10px',
  },
});
interface SettingsIconButtonProps {
  notification?: 'info' | 'warning';
}

export const SettingsIconButton = styled(IconButton)<SettingsIconButtonProps>(({
  theme,
  notification,
}) => {
  const notificationStyles = {
    info: {
      backgroundColor: getInfoBackgroundColor(theme),
      ['&:hover']: {
        backgroundColor: darken(getInfoBackgroundColor(theme), 0.2),
      },
      paddingRight: '23px',
    },
    warning: {
      backgroundColor: getWarningBackgroundColor(theme),
      ['&:hover']: {
        backgroundColor: darken(getWarningBackgroundColor(theme), 0.2),
      },
      paddingRight: '23px',
    },
    default: {},
  };

  return {
    borderRadius: theme.shape.borderRadiusSecondary,
    ...notificationStyles[notification ?? 'default'],
  };
});
