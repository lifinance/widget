import { useAccount } from '@lifi/wallet-management'
import { useCallback, useMemo } from 'react'
import { useRouteExecutionStore } from './RouteExecutionStore.js'
import type { RouteExecution, RouteExecutionState } from './types.js'
import { RouteExecutionStatus } from './types.js'

export type RouteExecutionIndicator = 'idle' | 'active' | 'failed'

const isRecentTransaction = (route: RouteExecution): boolean => {
  const startedAt = route.route.steps[0]?.execution?.startedAt ?? 0
  return startedAt > 0 && Date.now() - startedAt < 1000 * 60 * 60 * 24 // 1 day
}

export const useRouteExecutionIndicator = (): RouteExecutionIndicator => {
  const { accounts } = useAccount()
  const accountAddresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  )
  const selector = useCallback(
    (state: RouteExecutionState): RouteExecutionIndicator => {
      const routes = Object.values(state.routes) as RouteExecution[]
      const recentOwnedRoutes = routes.filter(
        (route) =>
          accountAddresses.includes(route.route.fromAddress) &&
          isRecentTransaction(route)
      )
      if (
        recentOwnedRoutes.some((r) => r.status === RouteExecutionStatus.Failed)
      ) {
        return 'failed'
      }
      if (
        recentOwnedRoutes.some((r) => r.status === RouteExecutionStatus.Pending)
      ) {
        return 'active'
      }
      return 'idle'
    },
    [accountAddresses]
  )
  return useRouteExecutionStore(selector)
}
