import type { CSSObject } from '@mui/material';
import {
  AvatarGroup,
  Box,
  Avatar as MuiAvatar,
  Skeleton,
  avatarClasses,
  badgeClasses,
  styled,
} from '@mui/material';
import { avatarMask16 } from './utils.js';

export const AvatarMasked = styled(MuiAvatar)(({ theme }) => ({
  mask: avatarMask16,
}));

export const AvatarSkeleton = styled(Skeleton)(({ theme }) => ({
  mask: avatarMask16,
}));

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[800],
    borderRadius: '50%',
    height: root?.height,
    width: root?.width,
    color: theme.palette.text.secondary,
    mask: avatarMask16,
  };
});

export const AvatarDefaultBadge = styled(Box)(({ theme }) => {
  return {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[800],
    borderRadius: '50%',
    height: 16,
    width: 16,
  };
});
