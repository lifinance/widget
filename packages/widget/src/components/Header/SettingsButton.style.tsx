import { Badge as MuiBadge } from '@mui/material';
import { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { darken, styled } from '@mui/material/styles';
import { getInfoBackgroundColor, getWarningBackgroundColor } from '../../utils';

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
  const variantStyles = {
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
    ...variantStyles[variant ?? 'default'],
  };
});
