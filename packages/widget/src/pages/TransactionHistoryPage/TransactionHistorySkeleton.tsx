import { Box, Skeleton } from '@mui/material';
import { Card } from '../../components/Card';
import { TokenDivider } from '../../components/Token';

const TokenSkeleton = ({ showDivider }: { showDivider?: boolean }) => {
  return (
    <Box flex={1} px={2} pt={showDivider ? 1 : 0.5} pb={showDivider ? 0 : 1}>
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
          <Skeleton width={40} height={30} variant="text" />
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
        </Box>
        <Skeleton
          width={64}
          height={12}
          sx={{ marginTop: 0.5 }}
          variant="rounded"
        />
        <Skeleton
          width={96}
          height={12}
          variant="rounded"
          sx={{ marginTop: 0.5, marginLeft: 0.5 }}
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
        pt={2}
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
        <TokenDivider />
        <TokenSkeleton />
      </Box>
    </Card>
  );
};
