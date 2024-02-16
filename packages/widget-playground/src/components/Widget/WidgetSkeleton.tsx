import { Box } from '@mui/material';
import { WidgetSkeletonContainer, Skeleton } from './WidgetView.style';

export const WidgetSkeleton = () => {
  return (
    <WidgetSkeletonContainer>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        <Skeleton variant="rounded" width={115} height={24} />
      </Box>
      <Skeleton variant="rounded" width={344} height={104} />
      <Skeleton variant="rounded" width={344} height={104} />
      <Skeleton variant="rounded" width={344} height={104} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rounded" width={288} height={48} />
        <Skeleton variant="rounded" width={48} height={48} />
      </Box>
    </WidgetSkeletonContainer>
  );
};
