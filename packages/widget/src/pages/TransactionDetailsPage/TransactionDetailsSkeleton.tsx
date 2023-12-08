import { Box, Skeleton } from '@mui/material';
import { Card } from '../../components/Card';
import { PageContainer } from '../../components/PageContainer';

const DetailedTextSkeleton = () => {
  return (
    <Box display="flex" ml={6}>
      <Skeleton width={64} height={16} variant="text" />
      <Skeleton
        width={96}
        height={16}
        variant="text"
        sx={{ marginLeft: 0.5 }}
      />
    </Box>
  );
};

const TransactionDetailsTokenSkeleton = () => {
  return (
    <Box py={1}>
      <Box display="flex" flex={1} alignItems="center">
        <Skeleton
          variant="rounded"
          width={32}
          height={32}
          sx={{
            borderRadius: '100%',
          }}
        />
        <Box display="flex" flexDirection="column" flex={1} ml={2}>
          <Skeleton width={64} height={32} variant="text" />
        </Box>
      </Box>
      <DetailedTextSkeleton />
    </Box>
  );
};

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
          <TransactionDetailsTokenSkeleton />
          {/* Bridge skeleton */}
          <Box py={1}>
            <Box display="flex" flex={1} alignItems="center">
              <Skeleton
                variant="rounded"
                width={32}
                height={32}
                sx={{
                  borderRadius: '100%',
                }}
              />
              <Box display="flex" flexDirection="column" flex={1} ml={2}>
                <Skeleton width={96} height={32} variant="text" />
              </Box>
            </Box>
            <DetailedTextSkeleton />
            <DetailedTextSkeleton />
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
                width={32}
                height={32}
                sx={{
                  borderRadius: '100%',
                }}
              />
              <Skeleton
                sx={{
                  ml: 2,
                }}
                width={96}
                height={32}
                variant="text"
              />
            </Box>
          ))}
          {/* Receiving Token skeleton */}
          <TransactionDetailsTokenSkeleton />
        </Box>
      </Card>
    </PageContainer>
  );
};
