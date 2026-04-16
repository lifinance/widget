import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { ActiveTransactionCard } from '../../components/TransactionCard/ActiveTransactionCard.js'
import { TransactionCardSkeleton } from '../../components/TransactionCard/TransactionCardSkeleton.js'
import { useRouteExecution } from '../../hooks/useRouteExecution.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const ActiveTransactionItem: React.FC<{ routeId: string }> = ({
  routeId,
}) => {
  const navigate = useNavigate()
  const { route, status, deleteRoute, restartRoute } = useRouteExecution({
    routeId,
    executeInBackground: true,
  })

  const lastActiveStep = route?.steps.findLast((step) => step.execution)

  if (!route || !lastActiveStep) {
    return <TransactionCardSkeleton active />
  }

  const handleClick = () => {
    navigate({
      to: navigationRoutes.transactionExecution,
      search: { routeId },
    })
  }

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    deleteRoute()
  }

  const handleRetry = () => {
    // NB: Do not stop propagation here:
    // open the transaction execution page and retry the transaction simultaneously
    restartRoute()
  }

  return (
    <ActiveTransactionCard
      route={route}
      status={status}
      onClick={handleClick}
      onDelete={handleDelete}
      onRetry={handleRetry}
    />
  )
}
