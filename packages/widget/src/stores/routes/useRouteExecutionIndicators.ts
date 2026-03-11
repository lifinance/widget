import { useAccount } from '@lifi/wallet-management'
import { useCallback, useMemo } from 'react'
import { useRouteExecutionStore } from './RouteExecutionStore.js'
import type { RouteExecution, RouteExecutionState } from './types.js'
import { RouteExecutionStatus } from './types.js'

export const useRouteExecutionIndicators = () => {
  const { accounts } = useAccount()
  const accountAddresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  )
  const selector = useCallback(
    (state: RouteExecutionState) => {
      const routes = Object.values(state.routes) as RouteExecution[]
      const ownedRoutes = routes.filter((route) =>
        accountAddresses.includes(route.route.fromAddress)
      )
      return {
        hasActiveRoutes: ownedRoutes.some((r) =>
          [RouteExecutionStatus.Pending, RouteExecutionStatus.Failed].includes(
            r.status
          )
        ),
        hasFailedRoutes: ownedRoutes.some(
          (r) => r.status === RouteExecutionStatus.Failed
        ),
      }
    },
    [accountAddresses]
  )
  return useRouteExecutionStore(selector)
}
