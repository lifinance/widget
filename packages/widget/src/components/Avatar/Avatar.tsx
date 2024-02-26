import type { SxProps, Theme } from '@mui/material';
import { Badge } from '@mui/material';
import { SmallAvatarSkeleton } from '../SmallAvatar.js';
import {
  AvatarDefault,
  AvatarDefaultBadge,
  AvatarSkeleton,
} from './Avatar.style.js';

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
      <AvatarSkeleton width={40} height={40} variant="circular" />
    </Badge>
  );
};
