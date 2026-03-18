import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { memo } from 'react'
import { Card } from '../../components/Card/Card.js'
import { DateLabel } from '../../components/DateLabel/DateLabel.js'
import { RouteTokens } from '../../components/RouteCard/RouteTokens.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const TransactionHistoryItem: React.FC<{
  route: RouteExtended
  transactionHash: string
  // startedAt in ms
  startedAt: number
}> = memo(({ route, transactionHash, startedAt }) => {
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
})
