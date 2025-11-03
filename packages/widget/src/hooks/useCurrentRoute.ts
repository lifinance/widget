import { useLocation } from '@tanstack/react-router'
import { useRouteExecutionStore } from '../stores/routes/RouteExecutionStore'
import { transactionRoutes } from '../utils/navigationRoutes'

export const useCurrentRoute = () => {
  const { pathname, search }: any = useLocation()
  const isTransactionExecutionPage = pathname.includes(
    transactionRoutes.transactionExecution
  )
  const routeId = search?.routeId

  const routeExecution = useRouteExecutionStore((state) =>
    isTransactionExecutionPage && routeId ? state.routes[routeId] : undefined
  )

  return { route: routeExecution?.route, status: routeExecution?.status }
}
