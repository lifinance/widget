import type { SxProps, Theme } from '@mui/material';
import { Badge, Skeleton } from '@mui/material';
import {
  AvatarDefault,
  AvatarDefaultBadge,
  AvatarSkeletonMaskedContainer,
} from './Avatar.style.js';
import { SmallAvatarSkeleton } from './SmallAvatar.js';

export const AvatarBadgedDefault: React.FC<{
  sx?: SxProps<Theme>;
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
  );
};

export const AvatarBadgedSkeleton: React.FC<{
  sx?: SxProps<Theme>;
}> = ({ sx }) => {
  return (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={<SmallAvatarSkeleton />}
      sx={sx}
    >
      <AvatarSkeleton />
    </Badge>
  );
};

export const AvatarSkeleton = () => {
  return (
    <AvatarSkeletonMaskedContainer>
      <Skeleton width={40} height={40} variant="circular" />
    </AvatarSkeletonMaskedContainer>
  );
};
