import { alpha, styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { Badge } from '../Badge';
import { badgeClasses } from '@mui/material/Badge';

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
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.info.dark, 0.2)
          : alpha(theme.palette.info.light, 0.2),
      paddingRight: '23px',
    },
    warning: {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? alpha(theme.palette.warning.dark, 0.4)
          : alpha(theme.palette.warning.light, 0.4),
      paddingRight: '23px',
    },
    default: {
      marginRight: '-8px',
    },
  };

  return {
    borderRadius: Math.max(
      theme.shape.borderRadius,
      theme.shape.borderRadiusSecondary,
    ),
    ...notificationStyles[notification ?? 'default'],
  };
});
