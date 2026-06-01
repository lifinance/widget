import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { ActiveTransactionCard } from '../../components/TransactionCard/ActiveTransactionCard.js'
import { TransactionCardSkeleton } from '../../components/TransactionCard/TransactionCardSkeleton.js'
import { usePacedRouteExecution } from '../../hooks/usePacedRouteExecution.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'

export const ActiveTransactionItem: React.FC<{ routeId: string }> = ({
  routeId,
}) => {
  const navigate = useNavigate()
  const { route, status, deleteRoute, restartRoute } = usePacedRouteExecution({
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
    // Let the click bubble to the card so it also opens the execution page:
    // restart and navigation happen together.
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
