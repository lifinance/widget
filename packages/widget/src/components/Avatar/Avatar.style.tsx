import type { CSSObject } from '@mui/material'
import {
  AvatarGroup,
  avatarClasses,
  Box,
  badgeClasses,
  Avatar as MuiAvatar,
  styled,
} from '@mui/material'
import type React from 'react'
import { getAvatarMask } from './utils.js'

export const AvatarMasked: React.FC<
  React.ComponentProps<typeof MuiAvatar> & {
    avatarSize?: number
    badgeSize?: number
  }
> = styled(MuiAvatar, {
  shouldForwardProp: (prop) => prop !== 'avatarSize' && prop !== 'badgeSize',
})<{ avatarSize?: number; badgeSize?: number }>(
  ({ avatarSize = 40, badgeSize = 16 }) => ({
    width: avatarSize,
    height: avatarSize,
    mask: getAvatarMask(badgeSize),
  })
)

export const TokenAvatarGroup: React.FC<
  React.ComponentProps<typeof AvatarGroup> & { badgeSize?: number }
> = styled(AvatarGroup)(({ theme }) => ({
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

export const AvatarDefault: React.FC<
  React.ComponentProps<typeof Box> & { badgeSize?: number }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeSize',
})<{ badgeSize?: number }>(({ theme, badgeSize = 16 }) => {
  const root = theme.components?.MuiAvatar?.styleOverrides?.root as CSSObject
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    height: root?.height,
    width: root?.width,
    color: theme.vars.palette.text.secondary,
    mask: getAvatarMask(badgeSize),
    background: theme.vars.palette.grey[300],
    ...theme.applyStyles('dark', {
      background: theme.vars.palette.grey[800],
    }),
  }
})

export const AvatarDefaultBadge: React.FC<
  React.ComponentProps<typeof Box> & { size?: number }
> = styled(Box, {
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

export const AvatarSkeletonContainer: React.FC<
  React.ComponentProps<typeof Box> & { badgeSize?: number }
> = styled(Box)(({ theme }) => ({
  background: theme.vars.palette.background.paper,
  borderRadius: '50%',
}))

export const AvatarSkeletonMaskedContainer: React.FC<
  React.ComponentProps<typeof Box> & { badgeSize?: number }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeSize',
})<{ badgeSize?: number }>(({ theme, badgeSize = 16 }) => ({
  background: theme.vars.palette.background.paper,
  borderRadius: '50%',
  mask: getAvatarMask(badgeSize),
}))
