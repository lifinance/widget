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
}> = ({ sx, avatarSize = 40, badgeSize = 16 }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<SmallAvatarSkeleton size={badgeSize} />}
      sx={sx}
    >
      <AvatarSkeleton avatarSize={avatarSize} badgeSize={badgeSize} />
    </Badge>
  )
}

const AvatarSkeleton: React.FC<{
  avatarSize: number
  badgeSize: number
}> = ({ avatarSize, badgeSize }) => {
  return (
    <AvatarSkeletonMaskedContainer badgeSize={badgeSize}>
      <Skeleton width={avatarSize} height={avatarSize} variant="circular" />
    </AvatarSkeletonMaskedContainer>
  )
}
