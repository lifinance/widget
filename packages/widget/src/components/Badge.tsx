import { styled } from '@mui/material/styles';
import { Badge as MuiBadge } from '@mui/material';
import { badgeClasses } from '@mui/material/Badge';

export const Badge = styled(MuiBadge)({
  [`.${badgeClasses.badge}`]: {
    top: '50%',
    width: 10,
    height: 10,
  },
});
