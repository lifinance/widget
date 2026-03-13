import { useAccount } from '@lifi/wallet-management'
import { useCallback, useMemo } from 'react'
import { hasEnumFlag } from '../../utils/enum.js'
import { useRouteExecutionStore } from './RouteExecutionStore.js'
import type { RouteExecution, RouteExecutionState } from './types.js'
import { RouteExecutionStatus } from './types.js'

export const useCompletedRoutesIds = () => {
  const { accounts } = useAccount()
  const accountAddresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  )
  const selector = useCallback(
    (state: RouteExecutionState) =>
      (Object.values(state.routes) as RouteExecution[])
        .filter(
          (item) =>
            accountAddresses.includes(item.route.fromAddress) &&
            hasEnumFlag(item.status, RouteExecutionStatus.Done)
        )
        .sort(
          (a, b) =>
            (b.route.steps[0]?.execution?.startedAt ?? 0) -
            (a.route.steps[0]?.execution?.startedAt ?? 0)
        )
        .map(({ route }) => route.id),
    [accountAddresses]
  )
  return useRouteExecutionStore(selector)
}
