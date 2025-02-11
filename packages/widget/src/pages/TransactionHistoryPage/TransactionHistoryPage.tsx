import type { FullStatusData } from '@lifi/sdk'
import { Box, List } from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import type React from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { PageContainer } from '../../components/PageContainer.js'
import { useHeader } from '../../hooks/useHeader.js'
import { useTransactionHistory } from '../../hooks/useTransactionHistory.js'

import { useListHeight } from '../../hooks/useListHeight.js'
import { TransactionHistoryEmpty } from './TransactionHistoryEmpty.js'
import { TransactionHistoryItem } from './TransactionHistoryItem.js'
import { TransactionHistoryItemSkeleton } from './TransactionHistorySkeleton.js'
import { minTransactionListHeight } from './constants.js'

export const TransactionHistoryPage: React.FC = () => {
  // Parent ref and useVirtualizer should be in one file to avoid blank page (0 virtual items) issue
  const parentRef = useRef<HTMLDivElement | null>(null)
  const { data: transactions, isLoading } = useTransactionHistory()

  const { t } = useTranslation()
  useHeader(t('header.transactionHistory'))

  const { listHeight } = useListHeight({
    listParentRef: parentRef,
  })

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: transactions.length,
    overscan: 5,
    paddingEnd: 12,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 186,
    getItemKey: (index) =>
      `${(transactions[index] as FullStatusData).transactionId}-${index}`,
  })

  if (!transactions.length && !isLoading) {
    return <TransactionHistoryEmpty />
  }

  return (
    <PageContainer disableGutters>
      <Box style={{ minHeight: minTransactionListHeight }}>
        <Box
          ref={parentRef}
          style={{
            height: listHeight,
          }}
          sx={{
            overflow: 'auto',
            paddingX: 4,
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
              style={{
                height: `${getTotalSize()}px`,
              }}
              sx={{
                position: 'relative',
              }}
              disablePadding
            >
              {getVirtualItems().map((item) => {
                const transaction = transactions[item.index]
                return (
                  <TransactionHistoryItem
                    key={item.key}
                    start={item.start}
                    transaction={transaction}
                  />
                )
              })}
            </List>
          )}
        </Box>
      </Box>
    </PageContainer>
  )
}
