import { Box, Skeleton } from '@mui/material';
import { Card } from '../../components/Card/Card.js';
import { TokenSkeleton } from '../../components/Token/Token.js';
import { TokenDivider } from '../../components/Token/Token.style.js';

export const TransactionHistoryItemSkeleton = () => {
  return (
    <Card
      style={{
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
      <Box px={2} py={2}>
        <TokenSkeleton />
        <Box pl={2.375} py={0.5}>
          <TokenDivider />
        </Box>
        <TokenSkeleton />
      </Box>
    </Card>
  );
};
