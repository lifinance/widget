import { Avatar, Skeleton, styled } from '@mui/material'
import { AvatarSkeletonContainer } from './Avatar.style.js'

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 16,
  height: 16,
}))

export const SmallAvatarSkeleton = () => {
  return (
    <AvatarSkeletonContainer>
      <Skeleton width={16} height={16} variant="circular" />
    </AvatarSkeletonContainer>
  )
}
