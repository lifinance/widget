import type { ExtendedChain } from '@lifi/sdk'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { RefObject } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { shallow } from 'zustand/shallow'
import {
  useChainOrderStore,
  useChainOrderStoreContext,
} from '../../stores/chains/ChainOrderStore'
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
  onSelect: (chain: ExtendedChain) => void
  selectedChainId?: number
  itemsSize: 'small' | 'medium'
  hasSearchQuery: boolean
  withPinnedChains: boolean
}

export const VirtualizedChainList = ({
  chains,
  hasSearchQuery,
  onSelect,
  selectedChainId,
  itemsSize,
  scrollElementRef,
  withPinnedChains,
}: VirtualizedChainListProps) => {
  const { t } = useTranslation()
  const chainOrderStore = useChainOrderStoreContext()
  const { isAllNetworks, setIsAllNetworks } = chainOrderStore.getState()
  const selectedChainIdRef = useRef(selectedChainId) // Store the initial selected chain ID to scroll to it once chains are loaded
  const hasScrolledRef = useRef(false)
  const [pinnedChains, setPinnedChain] = useChainOrderStore(
    (state) => [state.pinnedChains, state.setPinnedChain],
    shallow
  )
  const onPin = useCallback(
    (chainId: number) => {
      setPinnedChain(chainId)
    },
    [setPinnedChain]
  )

  const sortedChains = useMemo(() => {
    if (!pinnedChains.length) {
      return chains
    }
    // Pinning logic: move pinned chains to the top of the list
    const pinned = pinnedChains
      .map((id) => chains.find((c) => c.id === id))
      .filter(Boolean) as ExtendedChain[]
    const pinnedIds = new Set(pinned.map((c) => c.id))
    const rest = chains.filter((c) => !pinnedIds.has(c.id))
    return [...pinned, ...rest]
  }, [chains, pinnedChains])

  const showAllNetworks = useMemo(() => {
    return sortedChains.length > 1 && !hasSearchQuery
  }, [sortedChains.length, hasSearchQuery])

  const getItemKey = useCallback(
    (index: number) => {
      if (showAllNetworks && index === 0) {
        return 'all-chains'
      }
      const chainIndex = index - (showAllNetworks ? 1 : 0)
      return `${sortedChains[chainIndex].id}-${index}`
    },
    [sortedChains, showAllNetworks]
  )

  const onChainSelect = useCallback(
    (chain: ExtendedChain) => {
      setIsAllNetworks(false)
      onSelect(chain)
    },
    [onSelect, setIsAllNetworks]
  )

  const { getVirtualItems, getTotalSize, measure, scrollToIndex, range } =
    useVirtualizer({
      count: sortedChains.length + (showAllNetworks ? 1 : 0), // +1 for the all networks item
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

  useLayoutEffect(() => {
    // Only scroll if sortedChains is not empty, not "All Networks" and we haven't scrolled yet
    if (!hasScrolledRef.current && sortedChains.length > 0 && range) {
      const selectedChainIndex = sortedChains.findIndex(
        (chain) => chain.id === selectedChainIdRef.current
      )
      if (selectedChainIndex !== -1) {
        // Only scroll if the selected chain is not in the visible range
        // +1 and -1 to account for partially visible items
        if (
          range.startIndex + 1 > selectedChainIndex ||
          range.endIndex - 1 < selectedChainIndex
        ) {
          requestAnimationFrame(() => {
            scrollToIndex(selectedChainIndex, {
              align: 'center',
              behavior: 'smooth',
            })
          })
          hasScrolledRef.current = true // Mark as scrolled (when needed)
        }
      }
    }
  }, [sortedChains, scrollToIndex, range])

  return (
    <List
      className="long-list"
      style={{ height: getTotalSize() }}
      disablePadding
    >
      {getVirtualItems().map((item) => {
        if (showAllNetworks && item.index === 0) {
          return (
            <ListItem
              key={item.key}
              style={{
                height: `${itemsSize}px`,
                transform: `translateY(${item.start}px)`,
                padding: 0,
              }}
            >
              <ListItemButton
                onClick={() => {
                  setIsAllNetworks(true)
                }}
                selected={isAllNetworks}
                size={itemsSize}
              >
                <ListItemAvatar size={itemsSize}>
                  <AllChainsAvatar chains={chains} size={itemsSize} />
                </ListItemAvatar>
                <ListItemText
                  primary={t('main.allNetworks')}
                  size={itemsSize}
                />
              </ListItemButton>
            </ListItem>
          )
        }

        const chain = sortedChains[item.index - (showAllNetworks ? 1 : 0)]
        return (
          <ChainListItem
            key={item.key}
            chain={chain}
            onSelect={onChainSelect}
            selected={!isAllNetworks && chain.id === selectedChainId}
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
