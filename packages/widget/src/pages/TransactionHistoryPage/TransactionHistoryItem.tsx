import type { FullStatusData, StatusResponse } from '@lifi/sdk'
import { Box } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { Card } from '../../components/Card/Card.js'
import { DateLabel } from '../../components/DateLabel/DateLabel.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { useTools } from '../../hooks/useTools.js'
import { buildRouteFromTxHistory } from '../../utils/converters.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const TransactionHistoryItem: React.FC<{
  transaction: StatusResponse
}> = ({ transaction }) => {
  const navigate = useNavigate()
  const { tools } = useTools()

  const routeExecution = useMemo(
    () => buildRouteFromTxHistory(transaction as FullStatusData, tools),
    [transaction, tools]
  )

  if (!routeExecution?.route) {
    return null
  }

  const handleClick = () => {
    navigate({
      to: navigationRoutes.transactionDetails,
      search: {
        transactionHash: (transaction as FullStatusData).sending.txHash,
      },
    })
  }

  const startedAt = new Date(
    (routeExecution.route.steps[0].execution?.startedAt ?? 0) * 1000
  )

  return (
    <Card onClick={handleClick} indented>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <DateLabel date={startedAt} />
        <RouteTokens route={routeExecution.route} />
      </Box>
    </Card>
  )
}
