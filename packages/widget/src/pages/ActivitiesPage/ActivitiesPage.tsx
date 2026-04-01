import { Box, List } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useTransactionList } from '../../hooks/useTransactionList.js'
import { ActiveTransactionItem } from './ActiveTransactionItem.js'
import { ActivitiesPageMenuButton } from './ActivitiesPageMenuButton.js'
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js'
import { TransactionHistoryItem } from './TransactionHistoryItem.js'
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js'

const SKELETON_COUNT = 3

export const ActivitiesPage = () => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null)
  const { items, isLoading } = useTransactionList()

  const { t } = useTranslation()

  useHeader(t('header.activities'), <ActivitiesPageMenuButton />)

  const { listHeight } = useListHeight({
    listParentRef: parentRef,
  })

  const hasStoreItems = items.length > 0
  const skeletonCount = isLoading && hasStoreItems ? SKELETON_COUNT : 0
  const totalCount = items.length + skeletonCount

  const getItemKey = useCallback(
    (index: number) => {
      if (index >= items.length) {
        return `skeleton-${index}`
      }
      const item = items[index]
      if (item.type === 'active') {
        return `active-${item.routeId}`
      }
      return `${item.type}-${item.txHash || item.routeExecution.route.id}`
    },
    [items]
  )

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: hasStoreItems ? totalCount : 0,
    overscan: 3,
    paddingEnd: 12,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => (items[index]?.type === 'active' ? 210 : 188),
    getItemKey,
  })

  if (!items.length && !isLoading) {
    return <TransactionHistoryEmpty />
  }

  return (
    <PageContainer disableGutters style={{ minHeight: 544 }}>
      <Box
        ref={parentRef}
        style={{ height: listHeight }}
        sx={{ overflow: 'auto', paddingX: 3 }}
      >
        {isLoading && !hasStoreItems ? (
          <List disablePadding>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <TransactionHistoryItemSkeleton key={index} />
            ))}
          </List>
        ) : (
          <List
            className="long-list"
            style={{ height: getTotalSize(), position: 'relative' }}
            disablePadding
          >
            {getVirtualItems().map((item) => {
              const listItem =
                item.index < items.length ? items[item.index] : null
              return (
                <li
                  key={item.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    paddingBottom: 16,
                    transform: `translateY(${item.start}px)`,
                    listStyle: 'none',
                  }}
                >
                  {!listItem ? (
                    <TransactionHistoryItemSkeleton />
                  ) : listItem.type === 'active' ? (
                    <ActiveTransactionItem routeId={listItem.routeId} />
                  ) : (
                    <TransactionHistoryItem
                      route={listItem.routeExecution.route}
                      type={listItem.type}
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
