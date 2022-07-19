import { Avatar, AvatarGroup } from '@mui/material';
import { avatarClasses } from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 16,
  height: 16,
  border: `2px solid ${theme.palette.background.paper}`,
}));

export const TokenAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  [`& .${avatarClasses.root}`]: {
    background: theme.palette.background.paper,
  },
  [`& .${avatarClasses.root}:last-child`]: {
    marginLeft: theme.spacing(-1),
    boxSizing: 'border-box',
  },
}));
