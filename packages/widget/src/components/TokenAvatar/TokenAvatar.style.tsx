import type { CSSObject } from '@mui/material';
import { AvatarGroup, Box } from '@mui/material';
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

export const AvatarDefault = styled(Box)(({ theme }) => {
  const root = theme.components?.MuiAvatar?.styleOverrides?.root as CSSObject;
  return {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[800],
    borderRadius: '50%',
    height: root?.height,
    width: root?.width,
  };
});

export const AvatarDefaultBadge = styled(Box)(({ theme }) => {
  const root = theme.components?.MuiAvatar?.styleOverrides?.root as CSSObject;
  return {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[800],
    border: `2px solid ${theme.palette.background.paper}`,
    borderRadius: '50%',
    height: ((root?.height ?? 40) as number) / 2,
    width: ((root?.width ?? 40) as number) / 2,
  };
});
