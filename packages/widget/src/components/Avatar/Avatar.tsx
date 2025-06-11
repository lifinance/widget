import type { SxProps, Theme } from '@mui/material'
import { Badge, Skeleton } from '@mui/material'
import {
  AvatarDefault,
  AvatarDefaultBadge,
  AvatarSkeletonMaskedContainer,
} from './Avatar.style.js'
import { SmallAvatarSkeleton } from './SmallAvatar.js'

export const AvatarBadgedDefault: React.FC<{
  sx?: SxProps<Theme>
}> = ({ sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<AvatarDefaultBadge />}
      sx={sx}
    >
      <AvatarDefault />
    </Badge>
  )
}

export const AvatarBadgedSkeleton: React.FC<{
  sx?: SxProps<Theme>
  avatarSize?: number
  badgeSize?: number
}> = ({ sx, avatarSize, badgeSize }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<SmallAvatarSkeleton size={badgeSize} />}
      sx={sx}
    >
      <AvatarSkeleton size={avatarSize} />
    </Badge>
  )
}

export const AvatarSkeleton: React.FC<{
  size?: number
}> = ({ size = 40 }) => {
  return (
    <AvatarSkeletonMaskedContainer>
      <Skeleton width={size} height={size} variant="circular" />
    </AvatarSkeletonMaskedContainer>
  )
}
