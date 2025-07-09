import type { ExtendedChain } from '@lifi/sdk'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { List } from './ChainList.style'
import { ChainListItem } from './ChainListItem'

interface VirtualizedChainListProps {
  scrollElementRef: RefObject<HTMLDivElement | null>
  chains: ExtendedChain[]
  onSelect: (chain: ExtendedChain) => void
  selectedChainId?: number
  itemsSize: 'small' | 'medium'
}

export const VirtualizedChainList = ({
  chains,
  onSelect,
  selectedChainId,
  itemsSize,
  scrollElementRef,
}: VirtualizedChainListProps) => {
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
      return `${sortedChains[index].id}-${index}`
    },
    [sortedChains]
  )

  const { getVirtualItems, getTotalSize, measure } = useVirtualizer({
    count: sortedChains.length,
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
        const chain = sortedChains[item.index]
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
