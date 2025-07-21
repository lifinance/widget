import type { ExtendedChain } from '@lifi/sdk'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore'
import { List } from './ChainList.style'
import { ChainListItem } from './ChainListItem'

interface VirtualizedChainListProps {
  scrollElementRef: RefObject<HTMLDivElement | null>
  chains: ExtendedChain[]
  onSelect: (chain: ExtendedChain) => void
  selectedChainId?: number
  itemsSize: 'small' | 'medium'
  withPinnedChains: boolean
}

export const VirtualizedChainList = ({
  chains,
  onSelect,
  selectedChainId,
  itemsSize,
  scrollElementRef,
  withPinnedChains,
}: VirtualizedChainListProps) => {
  const initialSelectedChainIdRef = useRef(selectedChainId)
  const pinnedChains = useChainOrderStore((state) => state.pinnedChains)
  const sortedChains = useMemo(() => {
    const selectedChain = chains.find(
      (chain) => chain.id === initialSelectedChainIdRef.current
    )
    const chainsWithoutSelected = chains.filter(
      (chain) => chain.id !== initialSelectedChainIdRef.current
    )
    if (!pinnedChains.length) {
      // No pinning: just selected, then the rest
      return selectedChain ? [selectedChain, ...chainsWithoutSelected] : chains
    }
    // Pinning logic: move pinned chains to the top of the list
    const pinned = pinnedChains
      .map((id) => chainsWithoutSelected.find((c) => c.id === id))
      .filter(Boolean) as ExtendedChain[]
    const pinnedIds = new Set(pinned.map((c) => c.id))
    const rest = chainsWithoutSelected.filter((c) => !pinnedIds.has(c.id))
    return selectedChain
      ? [selectedChain, ...pinned, ...rest]
      : [...pinned, ...rest]
  }, [chains, pinnedChains])

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

  const setPinnedChain = useChainOrderStore((state) => state.setPinnedChain)
  const onPin = useCallback(
    (chainId: number) => {
      setPinnedChain(chainId)
    },
    [setPinnedChain]
  )

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
            withPin={withPinnedChains}
            isPinned={pinnedChains.includes(chain.id)}
            onPin={onPin}
          />
        )
      })}
    </List>
  )
}
