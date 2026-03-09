import type { FullStatusData, StatusResponse } from '@lifi/sdk'
import { Box, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '../../components/Card/Card.js'
import { RouteTokens } from '../../components/Step/RouteTokens.js'
import { useTools } from '../../hooks/useTools.js'
import { buildRouteFromTxHistory } from '../../utils/converters.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const TransactionHistoryItem: React.FC<{
  transaction: StatusResponse
}> = ({ transaction }) => {
  const { i18n } = useTranslation()
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
    <Card onClick={handleClick}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            pb: 1.5,
          }}
        >
          <Typography
            sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}
          >
            {startedAt.toLocaleString(i18n.language, { dateStyle: 'long' })}
          </Typography>
          <Typography
            sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 500 }}
          >
            {startedAt.toLocaleString(i18n.language, { timeStyle: 'short' })}
          </Typography>
        </Box>
        <RouteTokens route={routeExecution.route} />
      </Box>
    </Card>
  )
}
