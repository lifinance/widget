import { styled } from '@mui/material/styles';
import { Badge as MuiBadge } from '@mui/material';
import { badgeClasses } from '@mui/material/Badge';

export const Badge = styled(MuiBadge)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [`.${badgeClasses.badge}`]: {
    width: 10,
    height: 10,
    // the following removes MUI styling so we can position with the badge with flex
    position: 'relative',
    transform: 'translateX(0%)',
  },
}));
