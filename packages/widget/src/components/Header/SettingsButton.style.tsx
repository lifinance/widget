import { darken, styled } from '@mui/material/styles';
import { Badge as MuiBadge, IconButton } from '@mui/material';
import { getInfoBackgroundColor, getWarningBackgroundColor } from '../../utils';
import { badgeClasses } from '@mui/material/Badge';

export const SettingsIconBadge = styled(MuiBadge)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [`.${badgeClasses.badge}`]: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    transform: 'translate(80%, -80%)',
  },
}));

interface SettingsIconButtonProps {
  notification?: 'info' | 'warning';
}

export const SettingsIconButton = styled(IconButton, {
  shouldForwardProp: (props) => props !== 'notification',
})<SettingsIconButtonProps>(({ theme, notification }) => {
  const notificationStyles = {
    info: {
      backgroundColor: getInfoBackgroundColor(theme),
      '&:hover': {
        backgroundColor: darken(getInfoBackgroundColor(theme), 0.2),
      },
    },
    warning: {
      backgroundColor: getWarningBackgroundColor(theme),
      '&:hover': {
        backgroundColor: darken(getWarningBackgroundColor(theme), 0.2),
      },
    },
    default: {
      marginRight: theme.spacing(-1.25),
    },
  };

  return {
    borderRadius: 20,
    ...notificationStyles[notification ?? 'default'],
  };
});
