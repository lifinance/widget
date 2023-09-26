import { Container, Box, Typography, Skeleton } from '@mui/material';
import { Card } from '../../components/Card';
import EvStationIcon from '@mui/icons-material/EvStation';
import DoneIcon from '@mui/icons-material/Done';
import { CircularIcon } from '../../components/Step/CircularProgress.style';

const DetailedTextSkeleton = () => {
  return (
    <Box display="flex" ml={6} mb={1}>
      <Skeleton width={64} height={12} variant="rounded" />
      <Skeleton
        width={96}
        height={12}
        variant="rounded"
        sx={{ marginLeft: 0.5 }}
      />
    </Box>
  );
};

const TransactionDetailsTokenSkeleton = () => {
  return (
    <Box mb={2}>
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
          <Skeleton width={40} height={32} variant="text" />
        </Box>
      </Box>
      <DetailedTextSkeleton />
    </Box>
  );
};

export const TransactionDetailsSkeleton = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
        pb={1}
      >
        <Typography fontSize={12}>
          <Skeleton width={96} height={32} variant="text" />
        </Typography>
        <Typography fontSize={12}>
          <Skeleton width={40} height={32} variant="text" />
        </Typography>
      </Box>
      <Card
        sx={{
          padding: 2,
        }}
        variant={'default'}
      >
        <Skeleton width={64} height={32} variant="text" sx={{ mb: 1 }} />
        {/* Token skeleton */}
        <TransactionDetailsTokenSkeleton />
        {/* Bridge Skeleton */}
        <Box mb={2}>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          mb={2}
        >
          <CircularIcon height={32} width={32} status={'NOT_STARTED'}>
            <DoneIcon
              color="disabled"
              sx={{
                position: 'absolute',
                fontSize: '1rem',
              }}
            />
          </CircularIcon>
          <Skeleton
            sx={{
              ml: 2,
            }}
            width={96}
            height={32}
            variant="text"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          mb={2}
        >
          <CircularIcon height={32} width={32} status={'NOT_STARTED'}>
            <EvStationIcon
              color={'disabled'}
              sx={{
                position: 'absolute',
                fontSize: '1rem',
              }}
            />
          </CircularIcon>
          <Skeleton
            sx={{
              ml: 2,
            }}
            width={96}
            height={32}
            variant="text"
          />
        </Box>
        {/* Receiving Token Skeleton */}
        <TransactionDetailsTokenSkeleton />
      </Card>
    </Container>
  );
};
