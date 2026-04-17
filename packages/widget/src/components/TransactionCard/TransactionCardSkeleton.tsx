import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { Box, Skeleton } from '@mui/material'
import type { JSX } from 'react'
import { Card } from '../Card/Card.js'
import { TokenSkeleton } from '../Token/Token.js'

interface TransactionCardSkeletonProps {
  active?: boolean
}

export const TransactionCardSkeleton = ({
  active,
}: TransactionCardSkeletonProps): JSX.Element => {
  return (
    <Card indented>
      {active ? (
        <Skeleton
          variant="rectangular"
          height={40}
          sx={(theme) => ({
            borderRadius: theme.vars.shape.borderRadiusTertiary,
            mb: 1.5,
          })}
        />
      ) : (
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
            height={18}
            sx={(theme) => ({
              borderRadius: theme.vars.shape.borderRadius,
            })}
          />
          <Skeleton
            variant="rectangular"
            width={64}
            height={18}
            sx={(theme) => ({
              borderRadius: theme.vars.shape.borderRadius,
            })}
          />
        </Box>
      )}
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
    </Card>
  )
}
