import { useAccount } from '@lifi/wallet-management'
import { useMemo } from 'react'
import { useDeduplicateRoutes } from '../../hooks/useDeduplicateRoutes.js'
import { useTransactionHistory } from '../../hooks/useTransactionHistory.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'
import type {
  RouteExecution,
  RouteExecutionState,
} from '../../stores/routes/types.js'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { hasEnumFlag } from '../../utils/enum.js'
import type {
  ActiveItem,
  HistoryItem,
  LocalItem,
  TransactionListItem,
} from './types.js'

const routesSelector = (state: RouteExecutionState) => state.routes

export const useTransactionList = () => {
  const { accounts } = useAccount()
  const accountAddresses = useMemo(
    () => accounts.map((account) => account.address),
    [accounts]
  )

  const {
    data: apiRouteExecutions,
    rawData: rawTransactions,
    isLoading,
  } = useTransactionHistory()

  useDeduplicateRoutes(rawTransactions ?? [])

  const routes = useRouteExecutionStore(routesSelector)

  const items = useMemo<TransactionListItem[]>(() => {
    const owned = (Object.values(routes) as RouteExecution[]).filter((r) =>
      accountAddresses.includes(r.route.fromAddress)
    )
    const byStartedAt = (a: RouteExecution, b: RouteExecution) =>
      (b.route.steps[0]?.execution?.startedAt ?? 0) -
      (a.route.steps[0]?.execution?.startedAt ?? 0)

    const activeItems: ActiveItem[] = owned
      .filter(
        (r) =>
          r.status === RouteExecutionStatus.Pending ||
          r.status === RouteExecutionStatus.Failed
      )
      .sort(byStartedAt)
      .map((r) => ({
        type: 'active',
        routeId: r.route.id,
        startedAt: r.route.steps[0]?.execution?.startedAt ?? 0,
      }))

    const localItems: LocalItem[] = owned
      .filter((r) => hasEnumFlag(r.status, RouteExecutionStatus.Done))
      .sort(byStartedAt)
      .map((r) => ({
        type: 'local',
        routeExecution: r,
        txHash: getSourceTxHash(r.route) ?? '',
        // store startedAt is already in ms
        startedAt: r.route.steps[0]?.execution?.startedAt ?? 0,
      }))

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
