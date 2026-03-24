import { useAccount } from '@lifi/wallet-management'
import { useMemo } from 'react'
import type {
  ActiveItem,
  HistoryItem,
  LocalItem,
  TransactionListItem,
} from '../pages/ActivitiesPage/types.js'
import { useRouteExecutionStore } from '../stores/routes/RouteExecutionStore.js'
import type {
  RouteExecution,
  RouteExecutionState,
} from '../stores/routes/types.js'
import { RouteExecutionStatus } from '../stores/routes/types.js'
import { useDeduplicateRoutes } from '../stores/routes/useDeduplicateRoutes.js'
import { getSourceTxHash } from '../stores/routes/utils.js'
import { hasEnumFlag } from '../utils/enum.js'
import { useTransactionHistory } from './useTransactionHistory.js'

const routesSelector = (state: RouteExecutionState) => state.routes

export const useTransactionList = () => {
  const { accounts } = useAccount()
  const accountAddresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  )

  const { data: apiRouteExecutions, isLoading } = useTransactionHistory()

  useDeduplicateRoutes(apiRouteExecutions)

  const routes = useRouteExecutionStore(routesSelector)

  const items = useMemo<TransactionListItem[]>(() => {
    // Build the API txHash set synchronously so local items that already
    // appear in API history are excluded on the same render that history
    // arrives — before useDeduplicateRoutes (a useEffect) can clean the store.
    const apiTxHashes = new Set(
      apiRouteExecutions.map((r) => getSourceTxHash(r.route))
    )

    const activeItems: ActiveItem[] = []
    const localItems: LocalItem[] = []

    for (const r of Object.values(routes) as RouteExecution[]) {
      if (!accountAddresses.includes(r.route.fromAddress)) {
        continue
      }
      if (apiTxHashes.has(getSourceTxHash(r.route))) {
        continue
      }
      const startedAt = r.route.steps[0]?.execution?.startedAt ?? 0
      if (
        r.status === RouteExecutionStatus.Pending ||
        r.status === RouteExecutionStatus.Failed
      ) {
        activeItems.push({ type: 'active', routeId: r.route.id, startedAt })
      } else if (hasEnumFlag(r.status, RouteExecutionStatus.Done)) {
        localItems.push({
          type: 'local',
          routeExecution: r,
          txHash: getSourceTxHash(r.route) ?? '',
          // store startedAt is already in ms
          startedAt,
        })
      }
    }

    const historyItems: HistoryItem[] = apiRouteExecutions.map(
      (routeExecution) => ({
        type: 'history',
        routeExecution,
        txHash: getSourceTxHash(routeExecution.route) ?? '',
        // API startedAt is in seconds; multiply by 1000 to normalize to ms
        startedAt:
          (routeExecution.route.steps[0]?.execution?.startedAt ?? 0) * 1000,
      })
    )

    return [...activeItems, ...localItems, ...historyItems].sort(
      (a, b) => b.startedAt - a.startedAt
    )
  }, [accountAddresses, apiRouteExecutions, routes])

  return { items, isLoading }
}
