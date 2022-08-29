import { AvatarGroup } from '@mui/material';
import { avatarClasses } from '@mui/material/Avatar';
import { badgeClasses } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

export const TokenAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  [`& .${badgeClasses.badge}:last-child .${avatarClasses.root}`]: {
    marginLeft: theme.spacing(-1),
    boxSizing: 'border-box',
  },
  [`& .${badgeClasses.root}:last-child`]: {
    marginLeft: theme.spacing(1),
  },
}));
