import { Box, Skeleton } from '@mui/material';
import { Card } from '../../components/Card/Card.js';
import { PageContainer } from '../../components/PageContainer.js';
import { TokenSkeleton } from '../../components/Token/Token.js';

export const TransactionDetailsSkeleton = () => {
  return (
    <PageContainer>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
        pb={1}
        pt={0.75}
      >
        <Skeleton width={96} height={20} variant="text" />
        <Skeleton width={40} height={20} variant="text" />
      </Box>
      <Card mb={3} variant="default" sx={{ paddingX: 2 }}>
        <Box pt={2.5}>
          <Skeleton width={64} height={12} variant="rounded" />
        </Box>
        <Box py={1}>
          {/* Token skeleton */}
          <Box py={1}>
            <TokenSkeleton />
          </Box>
          {/* Bridge skeleton */}
          <Box py={1}>
            <TokenSkeleton disableDescription />
          </Box>
          {/* Steps skeleton */}
          {Array.from({ length: 3 }).map((_, key) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
              py={1}
              key={key}
            >
              <Skeleton
                variant="rounded"
                width={40}
                height={40}
                sx={{
                  borderRadius: '100%',
                }}
              />
              <Skeleton
                sx={{
                  ml: 2,
                }}
                width={96}
                height={24}
                variant="text"
              />
            </Box>
          ))}
          {/* Receiving Token skeleton */}
          <Box py={1}>
            <TokenSkeleton />
          </Box>
        </Box>
      </Card>
    </PageContainer>
  );
};
