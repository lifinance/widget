import type { CSSObject } from '@mui/material'
import {
  AvatarGroup,
  Box,
  Avatar as MuiAvatar,
  avatarClasses,
  badgeClasses,
  styled,
} from '@mui/material'
import { avatarMask16 } from './utils.js'

export const AvatarMasked = styled(MuiAvatar)(() => ({
  mask: avatarMask16,
}))

export const TokenAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  [`& .${badgeClasses.badge}:last-of-type .${avatarClasses.root}`]: {
    boxSizing: 'border-box',
  },
  [`& .${avatarClasses.root}`]: {
    border: 'none',
    marginLeft: 0,
  },
  [`& .${badgeClasses.root}:first-of-type`]: {
    marginLeft: theme.spacing(-1),
    border: 'none',
  },
  [`& .${badgeClasses.root}:last-of-type`]: {
    border: 'none',
  },
}))

export const AvatarDefault = styled(Box)(({ theme }) => {
  const root = theme.components?.MuiAvatar?.styleOverrides?.root as CSSObject
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
  }
})

export const AvatarDefaultBadge = styled(Box)(({ theme }) => {
  return {
    background:
      theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[800],
    borderRadius: '50%',
    height: 16,
    width: 16,
  }
})

export const AvatarSkeletonContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '50%',
}))

export const AvatarSkeletonMaskedContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '50%',
  mask: avatarMask16,
}))
