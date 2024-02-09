import { Avatar, Box, Skeleton, styled } from '@mui/material';

export const SmallAvatar = styled(Avatar)(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 20,
  height: 20,
  border: `2px solid ${theme.palette.background.paper}`,
}));

export const SmallAvatarSkeletonBase = styled(Skeleton)(({ theme }) => ({
  border: `2px solid ${theme.palette.background.paper}`,
  width: 20,
  height: 20,
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
