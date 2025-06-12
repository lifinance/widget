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

export const AvatarMasked = styled(MuiAvatar, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: number }>(({ size = 40 }) => ({
  width: size,
  height: size,
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
    borderRadius: '50%',
    height: root?.height,
    width: root?.width,
    color: theme.vars.palette.text.secondary,
    mask: avatarMask16,
    background: theme.vars.palette.grey[300],
    ...theme.applyStyles('dark', {
      background: theme.vars.palette.grey[800],
    }),
  }
})

export const AvatarDefaultBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size?: number }>(({ theme, size = 16 }) => {
  return {
    borderRadius: '50%',
    height: size,
    width: size,
    background: theme.vars.palette.grey[300],
    ...theme.applyStyles('dark', {
      background: theme.vars.palette.grey[800],
    }),
  }
})

export const AvatarSkeletonContainer = styled(Box)(({ theme }) => ({
  background: theme.vars.palette.background.paper,
  borderRadius: '50%',
}))

export const AvatarSkeletonMaskedContainer = styled(Box)(({ theme }) => ({
  background: theme.vars.palette.background.paper,
  borderRadius: '50%',
  mask: avatarMask16,
}))
