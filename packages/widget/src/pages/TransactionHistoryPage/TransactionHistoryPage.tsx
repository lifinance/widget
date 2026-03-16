import { Box, List } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { ActiveTransactionItem } from './ActiveTransactionItem.js'
import { minTransactionListHeight } from './constants.js'
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js'
import { TransactionHistoryItem } from './TransactionHistoryItem.js'
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js'
import { useTransactionList } from './useTransactionList.js'

export const TransactionHistoryPage = () => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null)
  const { items, isLoading } = useTransactionList()

  const { t } = useTranslation()
  useHeader(t('header.transactionHistory'))

  const { listHeight } = useListHeight({
    listParentRef: parentRef,
  })

  const getItemKey = useCallback(
    (index: number) => {
      const item = items[index]
      if (item.type === 'active') {
        return `active-${item.routeId}`
      }
      return item.txHash || item.routeExecution.route.id
    },
    [items]
  )

  const { getVirtualItems, getTotalSize, measureElement } = useVirtualizer({
    count: items.length,
    overscan: 3,
    paddingEnd: 12,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 216,
    getItemKey,
  })

  if (!items.length && !isLoading) {
    return <TransactionHistoryEmpty />
  }

  return (
    <PageContainer
      disableGutters
      style={{ minHeight: minTransactionListHeight }}
    >
      <Box
        ref={parentRef}
        style={{ height: listHeight }}
        sx={{ overflow: 'auto', paddingX: 3 }}
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
            style={{ height: getTotalSize(), position: 'relative' }}
            disablePadding
          >
            {getVirtualItems().map((item) => {
              const listItem = items[item.index]
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
                    paddingBottom: 16,
                    transform: `translateY(${item.start}px)`,
                  }}
                >
                  {listItem.type === 'active' ? (
                    <ActiveTransactionItem routeId={listItem.routeId} />
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
