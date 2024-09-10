import {
  IconButton,
  Badge as MuiBadge,
  badgeClasses,
  darken,
  styled,
} from '@mui/material';
import {
  getInfoBackgroundColor,
  getWarningBackgroundColor,
} from '../../utils/colors.js';

export const SettingsIconBadge = styled(MuiBadge)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [`.${badgeClasses.badge}`]: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    transform: 'translate(70%, -70%)',
  },
}));

interface SettingsIconButtonProps {
  variant?: 'info' | 'warning';
}

export const SettingsIconButton = styled(IconButton, {
  shouldForwardProp: (props) => props !== 'variant',
})<SettingsIconButtonProps>(({ theme, variant }) => {
  switch (variant) {
    case 'info':
      return {
        backgroundColor: getInfoBackgroundColor(theme),
        '&:hover': {
          backgroundColor: darken(getInfoBackgroundColor(theme), 0.2),
        },
      };
    case 'warning':
      return {
        backgroundColor: getWarningBackgroundColor(theme),
        '&:hover': {
          backgroundColor: darken(getWarningBackgroundColor(theme), 0.2),
        },
      };
    default:
      break;
  }
});
