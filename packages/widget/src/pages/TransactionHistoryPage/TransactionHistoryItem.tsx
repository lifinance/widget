import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { Card } from '../../components/Card/Card.js'
import { DateLabel } from '../../components/DateLabel/DateLabel.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

interface TransactionHistoryItemProps {
  route: RouteExtended
  transactionHash: string
  // startedAt in ms
  startedAt: number
}

export const TransactionHistoryItem = memo(
  ({ route, transactionHash, startedAt }: TransactionHistoryItemProps) => {
    const navigate = useNavigate()

    const handleClick = () => {
      navigate({
        to: navigationRoutes.transactionDetails,
        search: { transactionHash },
      })
    }

    return (
      <Card onClick={handleClick} indented>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <DateLabel date={new Date(startedAt)} />
          <RouteTokens route={route} />
        </Box>
      </Card>
    )
  }
)
