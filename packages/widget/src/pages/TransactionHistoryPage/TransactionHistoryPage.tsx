import { Box, List } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import { type JSX, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import { useTransactionHistory } from '../../hooks/useTransactionHistory.js'
import { getSourceTxHash } from '../../stores/routes/utils.js'
import { minTransactionListHeight } from './constants.js'
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js'
import { TransactionHistoryItem } from './TransactionHistoryItem.js'
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js'

export const TransactionHistoryPage = (): JSX.Element => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null)
  const { data: transactions, isLoading } = useTransactionHistory()

  const { t } = useTranslation()
  useHeader(t('header.transactionHistory'))

  const { listHeight } = useListHeight({
    listParentRef: parentRef,
  })

  const getItemKey = useCallback(
    (index: number) => {
      const txHash = getSourceTxHash(transactions[index].route) ?? ''
      return `${txHash}-${index}`
    },
    [transactions]
  )

  const { getVirtualItems, getTotalSize, measureElement } = useVirtualizer({
    count: transactions.length,
    overscan: 3,
    paddingEnd: 12,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 208,
    getItemKey,
  })

  if (!transactions.length && !isLoading) {
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
              const listItem = transactions[item.index]
              const txHash = getSourceTxHash(listItem.route) ?? ''
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
                  <TransactionHistoryItem
                    route={listItem.route}
                    transactionHash={txHash}
                    startedAt={
                      (listItem.route.steps[0]?.execution?.startedAt ?? 0) *
                      1000
                    }
                  />
                </li>
              )
            })}
          </List>
        )}
      </Box>
    </PageContainer>
  )
}
