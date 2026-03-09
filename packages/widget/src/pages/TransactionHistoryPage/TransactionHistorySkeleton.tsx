import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box, Skeleton } from '@mui/material'
import { Card } from '../../components/Card/Card.js'
import { TokenSkeleton } from '../../components/Token/Token.js'

export const TransactionHistoryItemSkeleton = () => {
  return (
    <Card style={{ marginBottom: '16px' }}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pb: 1.5,
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TokenSkeleton />
          <Box
            sx={{
              width: 40,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowDownwardIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </Box>
          <TokenSkeleton />
        </Box>
      </Box>
    </Card>
  )
}
