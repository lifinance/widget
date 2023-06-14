import type { BoxProps } from '@mui/material';
import { Box, Skeleton } from '@mui/material';
import { useWidgetConfig } from '../../providers';
import { Card } from '../Card';
import type { RouteCardSkeletonProps } from './types';

export const RouteCardSkeleton: React.FC<RouteCardSkeletonProps & BoxProps> = ({
  variant,
  ...other
}) => {
  const { subvariant } = useWidgetConfig();

  const cardContent = (
    <Box flex={1}>
      {subvariant !== 'refuel' && subvariant !== 'nft' ? (
        <Box display="flex" alignItems="center" mb={2}>
          <Skeleton
            variant="rectangular"
            width={112}
            height={24}
            sx={(theme) => ({
              borderRadius: `${theme.shape.borderRadius}px`,
            })}
          />
        </Box>
      ) : null}
      <Box>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
          <Skeleton variant="text" width={96} height={32} />
        </Box>
        <Box ml={6} display="flex" alignItems="center">
          <Skeleton variant="text" width={102} height={16} />
          <Skeleton
            variant="text"
            width={72}
            height={16}
            sx={{ marginLeft: 1 }}
          />
        </Box>
      </Box>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Skeleton variant="text" width={64} height={20} />
        <Skeleton variant="text" width={64} height={20} />
        <Skeleton variant="text" width={48} height={20} />
        <Skeleton variant="text" width={32} height={20} />
      </Box>
    </Box>
  );

  return subvariant === 'refuel' || variant === 'cardless' ? (
    cardContent
  ) : (
    <Card indented {...other}>
      {cardContent}
    </Card>
  );
};
