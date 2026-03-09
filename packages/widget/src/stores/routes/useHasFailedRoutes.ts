import { useAccount } from '@lifi/wallet-management'
import { useRouteExecutionStore } from './RouteExecutionStore.js'
import type { RouteExecution } from './types.js'
import { RouteExecutionStatus } from './types.js'

export const useHasFailedRoutes = () => {
  const { accounts } = useAccount()
  const accountAddresses = accounts.map((account) => account.address)
  return useRouteExecutionStore((state) =>
    (Object.values(state.routes) as RouteExecution[]).some(
      (item) =>
        accountAddresses.includes(item.route.fromAddress) &&
        item.status === RouteExecutionStatus.Failed
    )
  )
}
