import { Avatar, Skeleton, styled } from '@mui/material'
import { AvatarSkeletonContainer } from './Avatar.style.js'

interface SmallAvatarProps {
  size?: number
}

export const SmallAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'size',
})<SmallAvatarProps>(({ theme, size = 16 }) => ({
  background: theme.vars.palette.background.paper,
  width: size,
  height: size,
}))

export const SmallAvatarSkeleton: React.FC<{
  size?: number
}> = ({ size = 16 }) => {
  return (
    <AvatarSkeletonContainer>
      <Skeleton width={size} height={size} variant="circular" />
    </AvatarSkeletonContainer>
  )
}
