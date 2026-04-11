import type { RouteExtended } from '@lifi/sdk'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { TransactionExecutionContent } from './TransactionExecutionContent.js'
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
    <TransactionExecutionContent
      route={route}
      status={status}
      restartRoute={restartRoute}
      deleteRoute={deleteRoute}
    />
  )
}
