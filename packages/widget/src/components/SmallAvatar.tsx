import { Avatar, Box, Skeleton, styled } from '@mui/material';

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 16,
  height: 16,
}));

export const SmallAvatarSkeletonBase = styled(Skeleton)(({ theme }) => ({
  width: 16,
  height: 16,
}));

export const SmallAvatarSkeletonContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: '50%',
}));

export const SmallAvatarSkeleton = () => {
  return (
    <SmallAvatarSkeletonContainer>
      <SmallAvatarSkeletonBase variant="circular" />
    </SmallAvatarSkeletonContainer>
  );
};
