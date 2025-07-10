import type { ExtendedChain } from '@lifi/sdk'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AllChainsAvatar } from './AllChainsAvatar'
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style'
import { ChainListItem } from './ChainListItem'

interface VirtualizedChainListProps {
  scrollElementRef: RefObject<HTMLDivElement | null>
  chains: ExtendedChain[]
  onSelect: (chain: ExtendedChain | undefined) => void
  selectedChainId?: number
  itemsSize: 'small' | 'medium'
  hasSearchQuery: boolean
}

export const VirtualizedChainList = ({
  chains,
  hasSearchQuery,
  onSelect,
  selectedChainId,
  itemsSize,
  scrollElementRef,
}: VirtualizedChainListProps) => {
  const { t } = useTranslation()
  const initialSelectedChainIdRef = useRef(selectedChainId)
  const sortedChains = useMemo(() => {
    const selectedChain = chains.find(
      (chain) => chain.id === initialSelectedChainIdRef.current
    )
    const otherChains = chains.filter(
      (chain) => chain.id !== initialSelectedChainIdRef.current
    )
    return selectedChain ? [selectedChain, ...otherChains] : chains
  }, [chains])

  const getItemKey = useCallback(
    (index: number) => {
      if (!hasSearchQuery && index === 0) {
        return 'all-chains'
      }
      const chainIndex = index - (!hasSearchQuery ? 1 : 0)
      return `${sortedChains[chainIndex].id}-${index}`
    },
    [sortedChains, hasSearchQuery]
  )

  const { getVirtualItems, getTotalSize, measure } = useVirtualizer({
    count: sortedChains.length + (!hasSearchQuery ? 1 : 0), // +1 for the all chains item
    overscan: 3,
    paddingEnd: 0,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => {
      return itemsSize === 'small' ? 48 : 60
    },
    getItemKey,
  })

  // Using mountOnEnter of the ExpansionTransition component
  // leads to a short delay for setting up scrollElementRef,
  // which in turn leads to getVirtualItems() returning an empty array.
  // Workaround: Re-measure when scroll element becomes available
  useEffect(() => {
    if (scrollElementRef.current) {
      measure()
    }
  }, [measure, scrollElementRef.current])

  return (
    <List
      className="long-list"
      style={{ height: getTotalSize() }}
      disablePadding
    >
      {getVirtualItems().map((item) => {
        if (!hasSearchQuery && item.index === 0) {
          return (
            <ListItem
              style={{
                height: `${itemsSize}px`,
                transform: `translateY(${item.start}px)`,
                padding: 0,
              }}
            >
              <ListItemButton
                key={item.key}
                onClick={() => onSelect(undefined)}
                selected={selectedChainId === undefined}
                size={itemsSize}
              >
                <ListItemAvatar size={itemsSize}>
                  <AllChainsAvatar chains={chains} size={itemsSize} />
                </ListItemAvatar>
                <ListItemText primary={t('main.allChains')} size={itemsSize} />
              </ListItemButton>
            </ListItem>
          )
        }

        const chain = sortedChains[item.index - (!hasSearchQuery ? 1 : 0)]
        return (
          <ChainListItem
            key={item.key}
            chain={chain}
            onSelect={onSelect}
            selected={chain.id === selectedChainId}
            itemsSize={itemsSize}
            size={item.size}
            start={item.start}
          />
        )
      })}
    </List>
  )
}
