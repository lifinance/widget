import type {
  ExtendedTransactionInfo,
  FullStatusData,
  StatusResponse,
} from '@lifi/sdk'
import { Box, List } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useTransactionHistory } from '../../hooks/useTransactionHistory.js'
import { useRouteExecutionStore } from '../../stores/routes/RouteExecutionStore.js'
import type { RouteExecutionState } from '../../stores/routes/types.js'
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js'
import { ActiveTransactionCard } from './ActiveTransactionCard.js'
import { minTransactionListHeight } from './constants.js'
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js'
import { TransactionHistoryItem } from './TransactionHistoryItem.js'
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js'

type ActiveItem = { type: 'active'; routeId: string; startedAt: number }
type HistoryItem = {
  type: 'history'
  transaction: StatusResponse
  startedAt: number
}
type TransactionListItem = ActiveItem | HistoryItem

const routeStartedAtSelector =
  (routeIds: string[]) => (state: RouteExecutionState) =>
    Object.fromEntries(
      routeIds.map((id) => [
        id,
        state.routes[id]?.route.steps[0]?.execution?.startedAt ?? 0,
      ])
    )

export const TransactionHistoryPage = () => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null)
  const { data: transactions, isLoading } = useTransactionHistory()
  const executingRouteIds = useExecutingRoutesIds()

  const { t } = useTranslation()
  useHeader(t('header.transactionHistory'))

  const { listHeight } = useListHeight({
    listParentRef: parentRef,
  })

  const startedAtByRouteId = useRouteExecutionStore(
    routeStartedAtSelector(executingRouteIds)
  )

  const allItems = useMemo<TransactionListItem[]>(() => {
    const activeItems: ActiveItem[] = executingRouteIds.map((routeId) => ({
      type: 'active',
      routeId,
      startedAt: startedAtByRouteId[routeId] ?? 0,
    }))
    const historyItems: HistoryItem[] = transactions.map((transaction) => ({
      type: 'history',
      transaction,
      startedAt:
        ((transaction as FullStatusData).sending as ExtendedTransactionInfo)
          ?.timestamp ?? 0,
    }))
    return [...activeItems, ...historyItems].sort(
      (a, b) => b.startedAt - a.startedAt
    )
  }, [executingRouteIds, startedAtByRouteId, transactions])

  const getItemKey = useCallback(
    (index: number) => {
      const item = allItems[index]
      return item.type === 'active'
        ? `active-${item.routeId}`
        : `history-${(item.transaction as FullStatusData).transactionId}-${index}`
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
                      transaction={listItem.transaction}
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
