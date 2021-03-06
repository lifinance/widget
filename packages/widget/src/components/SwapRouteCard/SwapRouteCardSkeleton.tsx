import { Box, BoxProps, Skeleton } from '@mui/material';
import { Card } from '../Card';
import { SwapRouteCardSkeletonProps } from './types';

export const SwapRouteCardSkeleton: React.FC<
  SwapRouteCardSkeletonProps & BoxProps
> = ({ dense, ...other }) => {
  return (
    <Card dense={dense} indented {...other}>
      <Skeleton
        variant="rectangular"
        width={120}
        height={24}
        sx={{ borderRadius: 0.5 }}
      />
      <Box my={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box mr={2}>
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
          <Skeleton variant="text" width={96} height={32} />
        </Box>
        <Box ml={6}>
          <Skeleton
            variant="text"
            width={102}
            height={16}
            sx={{ borderRadius: 0.5 }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Skeleton variant="text" width={56} height={20} />
          <Skeleton variant="text" width={52} height={16} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            flexDirection: 'column',
          }}
        >
          <Skeleton variant="text" width={40} height={20} />
          <Skeleton variant="text" width={48} height={16} />
        </Box>
      </Box>
    </Card>
  );
};
