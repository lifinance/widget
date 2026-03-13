import { Box, List } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useTransactionHistory } from '../../hooks/useTransactionHistory.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'
import type {
  RouteExecution,
  RouteExecutionState,
} from '../../stores/routes/types.js'
import { useCompletedRoutesIds } from '../../stores/routes/useCompletedRoutesIds.js'
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { ActiveTransactionCard } from './ActiveTransactionCard.js'
import { minTransactionListHeight } from './constants.js'
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js'
import { TransactionHistoryItem } from './TransactionHistoryItem.js'
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js'
import { useDeduplicateRoutes } from './useDeduplicateRoutes.js'

type ActiveItem = { type: 'active'; routeId: string; startedAt: number }
type LocalItem = {
  type: 'local'
  routeExecution: RouteExecution
  txHash: string
  // startedAt in ms
  startedAt: number
}
type HistoryItem = {
  type: 'history'
  routeExecution: RouteExecution
  txHash: string
  // startedAt in ms
  startedAt: number
}
type TransactionListItem = ActiveItem | LocalItem | HistoryItem

const routeDataSelector =
  (routeIds: string[]) => (state: RouteExecutionState) =>
    Object.fromEntries(routeIds.map((id) => [id, state.routes[id]]))

export const TransactionHistoryPage = () => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null)
  const {
    data: apiRouteExecutions,
    rawData: rawTransactions,
    isLoading,
  } = useTransactionHistory()
  const executingRouteIds = useExecutingRoutesIds()
  const completedRouteIds = useCompletedRoutesIds()

  useDeduplicateRoutes(rawTransactions ?? [])

  const { t } = useTranslation()
  useHeader(t('header.transactionHistory'))

  const { listHeight } = useListHeight({
    listParentRef: parentRef,
  })

  const executingRouteData = useRouteExecutionStore(
    routeDataSelector(executingRouteIds)
  )
  const completedRouteData = useRouteExecutionStore(
    routeDataSelector(completedRouteIds)
  )

  const allItems = useMemo<TransactionListItem[]>(() => {
    const activeItems: ActiveItem[] = executingRouteIds.map((routeId) => ({
      type: 'active',
      routeId,
      startedAt:
        executingRouteData[routeId]?.route.steps[0]?.execution?.startedAt ?? 0,
    }))
    const localItems: LocalItem[] = completedRouteIds
      .filter((id) => completedRouteData[id])
      .map((routeId) => {
        const routeExecution = completedRouteData[routeId]!
        return {
          type: 'local',
          routeExecution,
          txHash: getSourceTxHash(routeExecution.route) ?? '',
          // store startedAt is already in ms
          startedAt: routeExecution.route.steps[0]?.execution?.startedAt ?? 0,
        }
      })
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
  }, [
    apiRouteExecutions,
    completedRouteData,
    completedRouteIds,
    executingRouteData,
    executingRouteIds,
  ])

  const getItemKey = useCallback(
    (index: number) => {
      const item = allItems[index]
      if (item.type === 'active') {
        return `active-${item.routeId}`
      }
      return item.txHash || item.routeExecution.route.id
    },
    [allItems]
  )

  const { getVirtualItems, getTotalSize, measureElement } = useVirtualizer({
    count: allItems.length,
    overscan: 3,
    paddingEnd: 12,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 216,
    getItemKey,
  })

  if (!allItems.length && !isLoading) {
    return <TransactionHistoryEmpty />
  }

  return (
    <PageContainer
      disableGutters
      style={{ minHeight: minTransactionListHeight }}
    >
      <Box
        ref={parentRef}
        style={{
          height: listHeight,
        }}
        sx={{
          overflow: 'auto',
          paddingX: 3,
        }}
      >
        {isLoading ? (
          <List disablePadding>
            {Array.from({ length: 3 }).map((_, index) => (
              <TransactionHistoryItemSkeleton key={index} />
            ))}
          </List>
        ) : (
          <List
            className="long-list"
            style={{
              height: getTotalSize(),
              position: 'relative',
            }}
            disablePadding
          >
            {getVirtualItems().map((item) => {
              const listItem = allItems[item.index]
              return (
                <li
                  key={item.key}
                  ref={measureElement}
                  data-index={item.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    paddingBottom: 12,
                    transform: `translateY(${item.start}px)`,
                  }}
                >
                  {listItem.type === 'active' ? (
                    <ActiveTransactionCard routeId={listItem.routeId} />
                  ) : (
                    <TransactionHistoryItem
                      route={listItem.routeExecution.route}
                      transactionHash={listItem.txHash}
                      startedAt={listItem.startedAt}
                    />
                  )}
                </li>
              )
            })}
          </List>
        )}
      </Box>
    </PageContainer>
  )
}
