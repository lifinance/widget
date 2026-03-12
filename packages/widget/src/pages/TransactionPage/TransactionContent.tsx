import type { RouteExtended } from '@lifi/sdk'
import { Box } from '@mui/material'
import { WarningMessages } from '../../components/Messages/WarningMessages.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { ExecutionProgressCards } from './ExecutionProgressCards.js'
import { TransactionFailedButtons } from './TransactionFailedButtons.js'
import { TransactionReview } from './TransactionReview.js'

interface TransactionContentProps {
  route: RouteExtended
  status: RouteExecutionStatus
  executeRoute: () => void
  restartRoute: () => void
  deleteRoute: () => void
  routeRefreshing: boolean
}

export const TransactionContent: React.FC<TransactionContentProps> = ({
  route,
  status,
  executeRoute,
  restartRoute,
  deleteRoute,
  routeRefreshing,
}) => {
  if (status === RouteExecutionStatus.Idle) {
    return (
      <TransactionReview
        route={route}
        executeRoute={executeRoute}
        routeRefreshing={routeRefreshing}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ExecutionProgressCards route={route} status={status} />
      <WarningMessages route={route} allowInteraction />
      {status === RouteExecutionStatus.Failed ? (
        <TransactionFailedButtons
          route={route}
          restartRoute={restartRoute}
          deleteRoute={deleteRoute}
        />
      ) : null}
    </Box>
  )
}
