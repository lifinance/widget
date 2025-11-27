import { Box, Skeleton } from '@mui/material'
import { Card } from '../../components/Card/Card'
import { TokenSkeleton } from '../../components/Token/Token'
import { TokenDivider } from '../../components/Token/Token.style'

export const TransactionHistoryItemSkeleton = () => {
  return (
    <Card
      style={{
        marginBottom: '16px',
      }}
    >
      <Box
        sx={{
          pt: 2,
          px: 2,
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={96}
          height={16}
          sx={(theme) => ({
            borderRadius: theme.vars.shape.borderRadius,
          })}
        />
        <Skeleton
          variant="rectangular"
          width={64}
          height={16}
          sx={(theme) => ({
            borderRadius: theme.vars.shape.borderRadius,
          })}
        />
      </Box>
      <Box
        sx={{
          px: 2,
          py: 2,
        }}
      >
        <TokenSkeleton />
        <Box
          sx={{
            pl: 2.375,
            py: 0.5,
          }}
        >
          <TokenDivider />
        </Box>
        <TokenSkeleton />
      </Box>
    </Card>
  )
}
