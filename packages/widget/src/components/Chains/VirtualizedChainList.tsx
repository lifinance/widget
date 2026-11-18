import type { ExtendedChain } from '@lifi/sdk'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { JSX, RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useConfigPinnedChains } from '../../hooks/useConfigPinnedChains.js'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import { FormKeyHelper, type FormType } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { sortChainsByPins } from '../../utils/pinnedChains.js'
import { AllChainsAvatar } from './AllChainsAvatar.js'
import {
  chainRowLabelOffset,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style.js'
import { ChainListItem } from './ChainListItem.js'

interface VirtualizedChainListProps {
  scrollElementRef: RefObject<HTMLDivElement | null>
  formType: FormType
  chains: ExtendedChain[]
  onSelect: (chain: ExtendedChain) => void
  selectedChainId?: number
  itemsSize: 'small' | 'medium'
  hasSearchQuery: boolean
  withPinnedChains: boolean
}

export const VirtualizedChainList = ({
  formType,
  chains,
  hasSearchQuery,
  onSelect,
  selectedChainId,
  itemsSize,
  scrollElementRef,
  withPinnedChains,
}: VirtualizedChainListProps): JSX.Element => {
  const { t } = useTranslation()
  const selectedChainIdRef = useRef(selectedChainId) // Store the initial selected chain ID to scroll to it once chains are loaded
  const hasScrolledRef = useRef(false)
  const [
    pinnedChains,
    setPinnedChain,
    isAllNetworks,
    setIsAllNetworks,
    showAllNetworks,
  ] = useChainOrderStore((state) => [
    state.pinnedChains,
    state.setPinnedChain,
    state[`${formType}IsAllNetworks`],
    state.setIsAllNetworks,
    state[`${formType}ShowAllNetworks`],
  ])
  const { setFieldValue } = useFieldActions()
  const onPin = useCallback(
    (chainId: number) => {
      setPinnedChain(chainId)
    },
    [setPinnedChain]
  )

  const configPins = useConfigPinnedChains(chains, formType)

  const sortedChains = useMemo(
    () => sortChainsByPins(chains, configPins, pinnedChains),
    [chains, configPins, pinnedChains]
  )

  const showAllNetworksOption = showAllNetworks && !hasSearchQuery

  const getItemKey = useCallback(
    (index: number) => {
      if (showAllNetworksOption && index === 0) {
        return 'all-chains'
      }
      const chainIndex = index - (showAllNetworksOption ? 1 : 0)
      return `${sortedChains[chainIndex].id}-${index}`
    },
    [sortedChains, showAllNetworksOption]
  )

  const estimateSize = useCallback(
    (index: number) => {
      const chain = sortedChains[index - (showAllNetworksOption ? 1 : 0)]
      const rowHeight = itemsSize === 'small' ? 48 : 60
      if (chain && configPins.get(chain.id)?.label) {
        return rowHeight + chainRowLabelOffset
      }
      return rowHeight
    },
    [sortedChains, configPins, showAllNetworksOption, itemsSize]
  )

  const onChainSelect = useCallback(
    (chain: ExtendedChain) => {
      setIsAllNetworks(false, formType)
      onSelect(chain)
    },
    [onSelect, setIsAllNetworks, formType]
  )

  const { getVirtualItems, getTotalSize, measure, range, getOffsetForIndex } =
    useVirtualizer({
      count: sortedChains.length + (showAllNetworksOption ? 1 : 0), // +1 for the all networks item
      overscan: 3,
      paddingEnd: 0,
      getScrollElement: () => scrollElementRef.current,
      // getItemKey changes with sortedChains, so the sizes update with the pins.
      estimateSize,
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
    // oxlint-disable-next-line react/exhaustive-deps -- the effect runs again on a later render, after the scroll element is set
  }, [measure, scrollElementRef.current])

  const scrollToIndex = useCallback(
    (index: number) => {
      requestAnimationFrame(() => {
        const offsetInfo = getOffsetForIndex(index, 'center')
        if (!scrollElementRef.current || !offsetInfo) {
          return
        }
        scrollElementRef.current.scrollTo({
          top: offsetInfo[0],
          left: 0,
          behavior: 'smooth',
        })
      })
    },
    // oxlint-disable-next-line react/exhaustive-deps -- the callback is created again on a later render, after the scroll element is set
    [getOffsetForIndex, scrollElementRef.current]
  )

  useEffect(() => {
    // Mark as scrolled if "All Networks" is initially selected
    if (isAllNetworks) {
      hasScrolledRef.current = true
      return
    }

    // Only scroll if sortedChains is not empty and we haven't scrolled yet
    if (!hasScrolledRef.current && sortedChains.length > 0 && range) {
      const chainIndex = sortedChains.findIndex(
        (chain) => chain.id === selectedChainIdRef.current
      )
      if (chainIndex !== -1) {
        // Virtual indices include the "All networks" row.
        const selectedChainIndex = chainIndex + (showAllNetworksOption ? 1 : 0)
        // Only scroll if the selected chain is not in the visible range
        // +1 and -1 to account for partially visible items
        if (
          range.startIndex + 1 > selectedChainIndex ||
          range.endIndex - 1 < selectedChainIndex
        ) {
          scrollToIndex(selectedChainIndex)
        }
      }
      hasScrolledRef.current = true // Mark as scrolled (when needed)
    }
  }, [sortedChains, scrollToIndex, range, isAllNetworks, showAllNetworksOption])

  const selectAllNetworks = useCallback(() => {
    setIsAllNetworks(true, formType)
    // Reset the chain and token fields when selecting all networks
    setFieldValue(FormKeyHelper.getChainKey(formType), '', { isTouched: true })
    setFieldValue(FormKeyHelper.getTokenKey(formType), '', { isTouched: true })
  }, [setIsAllNetworks, formType, setFieldValue])

  return (
    <List
      className="long-list"
      style={{ height: getTotalSize() }}
      disablePadding
    >
      {getVirtualItems().map((item) => {
        if (showAllNetworksOption && item.index === 0) {
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
                onClick={selectAllNetworks}
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

        const chain = sortedChains[item.index - (showAllNetworksOption ? 1 : 0)]
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
            isLocked={configPins.has(chain.id)}
            label={configPins.get(chain.id)?.label}
            onPin={onPin}
          />
        )
      })}
    </List>
  )
}
