import { TokenDivider } from '../../components/Token';
import { Card, Box, Skeleton } from '@mui/material';

const TokenSkeleton = ({ showDivider }: { showDivider?: boolean }) => {
  return (
    <Box flex={1} px={2} pt={0.5}>
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
      <Box display="flex" marginLeft="-16px">
        <Box
          display="flex"
          flexDirection={'column'}
          marginTop={0.5}
          visibility={showDivider ? 'visible' : 'hidden'}
        >
          <TokenDivider />
          <TokenDivider />
        </Box>

        <Skeleton width={64} height={12} variant="rounded" />
        <Skeleton
          width={96}
          height={12}
          variant="rounded"
          sx={{ marginLeft: 0.5 }}
        />
      </Box>
    </Box>
  );
};

export const TransactionHistorySkeleton = () => {
  return (
    <Card
      style={{
        marginRight: '24px',
        marginBottom: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
        pt={1.75}
        px={2}
      >
        <Skeleton
          variant="rectangular"
          width={96}
          height={16}
          sx={(theme) => ({
            borderRadius: `${theme.shape.borderRadius}px`,
          })}
        />
        <Skeleton
          variant="rectangular"
          width={64}
          height={16}
          sx={(theme) => ({
            borderRadius: `${theme.shape.borderRadius}px`,
          })}
        />
      </Box>
      <Box py={1}>
        <TokenSkeleton showDivider />
        <TokenSkeleton />
      </Box>
    </Card>
  );
};
