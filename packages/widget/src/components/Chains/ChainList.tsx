import type { ExtendedChain } from '@lifi/sdk'
import { Skeleton } from '@mui/material'
import type { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchNotFound } from '../Search/SearchNotFound.js'
import {
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style.js'
import { VirtualizedChainList } from './VirtualizedChainList.js'

interface ChainListProps {
  parentRef: RefObject<HTMLDivElement | null>
  chains: ExtendedChain[]
  onSelect: (chain: ExtendedChain) => void
  selectedChainId?: number
  isLoading: boolean
  hasSearchQuery: boolean
  inExpansion: boolean
}

export const ChainList = ({
  parentRef,
  chains,
  hasSearchQuery,
  onSelect,
  selectedChainId,
  isLoading,
  inExpansion,
}: ChainListProps) => {
  const { t } = useTranslation()

  const itemsSize = inExpansion ? 'small' : 'medium'

  if (isLoading) {
    return (
      <List disablePadding sx={{ cursor: 'default' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListItemButton
            key={index}
            size={itemsSize}
            sx={{ pointerEvents: 'none' }}
          >
            <ListItemAvatar size={itemsSize}>
              <Skeleton
                variant="circular"
                width={itemsSize === 'small' ? 32 : 40}
                height={itemsSize === 'small' ? 32 : 40}
                sx={{ marginRight: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="text"
                  width={'100%'}
                  height={itemsSize === 'small' ? 18 : 24}
                />
              }
              size={itemsSize}
            />
          </ListItemButton>
        ))}
      </List>
    )
  }

  if (!chains.length) {
    return (
      <SearchNotFound
        message={t('info.message.emptyChainList')}
        adjustForStickySearchInput={!inExpansion}
      />
    )
  }

  return (
    <VirtualizedChainList
      scrollElementRef={parentRef}
      chains={chains}
      hasSearchQuery={hasSearchQuery}
      onSelect={onSelect}
      selectedChainId={selectedChainId}
      itemsSize={itemsSize}
      withPinnedChains={inExpansion}
    />
  )
}
