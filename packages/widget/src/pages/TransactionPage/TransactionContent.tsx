import type { RouteExtended } from '@lifi/sdk'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { TransactionCompleted } from './TransactionCompleted.js'
import { TransactionFailed } from './TransactionFailed.js'
import { TransactionPending } from './TransactionPending.js'
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
  if (hasEnumFlag(status, RouteExecutionStatus.Done)) {
    const startedAt = new Date(route.steps[0].execution?.startedAt ?? 0)
    return <TransactionCompleted route={route} startedAt={startedAt} />
  }

  if (status === RouteExecutionStatus.Failed) {
    return (
      <TransactionFailed
        route={route}
        restartRoute={restartRoute}
        deleteRoute={deleteRoute}
      />
    )
  }

  if (status === RouteExecutionStatus.Pending) {
    return <TransactionPending route={route} />
  }

  return (
    <TransactionReview
      route={route}
      executeRoute={executeRoute}
      routeRefreshing={routeRefreshing}
    />
  )
}
