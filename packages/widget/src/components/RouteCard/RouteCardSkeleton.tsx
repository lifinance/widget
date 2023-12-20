import type { BoxProps } from '@mui/material';
import { Box, Skeleton } from '@mui/material';
import { useWidgetConfig } from '../../providers';
import { Card } from '../Card';
import { TokenSkeleton } from '../Token';
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
      <TokenSkeleton />
      <Box mt={2} display="flex" justifyContent="space-between">
        <Skeleton variant="text" width={64} height={20} />
        <Skeleton variant="text" width={56} height={20} />
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
