import type { ExtendedChain } from '@lifi/sdk'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style'

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

  const virtualizer = useVirtualizer({
    count: sortedChains.length,
    overscan: 3,
    paddingEnd: 0,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => {
      return itemsSize === 'small' ? 48 : 60
    },
    getItemKey: (index) => `${sortedChains[index].id}-${index}`,
  })

  // Using mountOnEnter of the ExpansionTransition component
  // leads to a short delay for setting up scrollElementRef,
  // which in turn leads to getVirtualItems() returning an empty array.
  // Workaround: Re-measure when scroll element becomes available
  useEffect(() => {
    if (scrollElementRef.current) {
      virtualizer.measure()
    }
  }, [virtualizer, scrollElementRef.current])

  const { getVirtualItems, getTotalSize } = virtualizer

  return (
    <List
      className="long-list"
      style={{ height: getTotalSize() }}
      disablePadding
    >
      {getVirtualItems().map((item) => {
        const chain = sortedChains[item.index]
        return (
          <ListItem
            key={item.key}
            style={{
              height: `${item.size}px`,
              transform: `translateY(${item.start}px)`,
              padding: 0,
            }}
          >
            <ListItemButton
              onClick={() => onSelect(chain)}
              selected={chain.id === selectedChainId}
              size={itemsSize}
            >
              <ListItemAvatar size={itemsSize}>
                <Avatar src={chain.logoURI} alt={chain.name} size={itemsSize}>
                  {chain.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={chain.name} size={itemsSize} />
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}
