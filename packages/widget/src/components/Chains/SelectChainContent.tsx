import type { ExtendedChain } from '@lifi/sdk'
import { Box, debounce, useTheme } from '@mui/material'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useDefaultElementId } from '../../hooks/useDefaultElementId'
import { useScrollableContainer } from '../../hooks/useScrollableContainer'
import { FormKeyHelper, type FormType } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { getWidgetMaxHeight } from '../../utils/widgetSize'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { FullPageContainer } from '../FullPageContainer'
import { ChainList } from './ChainList'
import { ChainSearchInput } from './ChainSearchInput'

interface SelectChainContentProps {
  formType: FormType
  onSelect?: (chain: ExtendedChain) => void
  inExpansion: boolean
}

const searchHeaderHeight = '80px'

export const SelectChainContent: React.FC<SelectChainContentProps> = memo(
  ({ formType, onSelect, inExpansion }) => {
    const theme = useTheme()
    const { chains, isLoading, setCurrentChain } = useChainSelect(formType)
    const elementId = useDefaultElementId()
    const scrollableContainer = useScrollableContainer(elementId)
    const [selectedChainId] = useFieldValues(
      FormKeyHelper.getChainKey(formType)
    )
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const [filteredChains, setFilteredChains] = useState<ExtendedChain[]>(
      chains ?? []
    )

    const scrollToTop = useCallback(() => {
      // Scroll widget container to top
      if (!inExpansion && scrollableContainer) {
        scrollableContainer.scrollTop = 0
      }
      // Scroll chain list to top
      if (inExpansion && listRef.current) {
        listRef.current.scrollTop = 0
      }
    }, [inExpansion, scrollableContainer])

    const debouncedFilterChains = useMemo(
      () =>
        debounce((chains: ExtendedChain[]) => {
          const value = inputRef.current?.value?.toLowerCase() || ''
          const filtered = value
            ? chains?.filter((chain) =>
                chain.name.toLowerCase().includes(value)
              )
            : chains
          setFilteredChains(filtered ?? [])
          scrollToTop()
        }, 250),
      [scrollToTop]
    )

    const onSelectChainFallback = useCallback(
      (chain: ExtendedChain) => {
        setCurrentChain(chain.id)
      },
      [setCurrentChain]
    )

    const onChange = useCallback(() => {
      debouncedFilterChains(chains ?? [])
    }, [chains, debouncedFilterChains])

    const onClear = useCallback(() => {
      setFilteredChains(chains ?? [])
      scrollToTop()
    }, [chains, scrollToTop])

    const listContainerHeight = useMemo(() => {
      const fullContainerHeight = getWidgetMaxHeight(theme)
      const heightValue =
        typeof fullContainerHeight === 'number'
          ? `${fullContainerHeight}px`
          : fullContainerHeight
      return `calc(${heightValue} - ${searchHeaderHeight})`
    }, [theme])

    return (
      <FullPageContainer disableGutters>
        <ChainSearchInput
          inputRef={inputRef}
          inExpansion={inExpansion}
          onChange={onChange}
          onClear={onClear}
          searchHeaderHeight={searchHeaderHeight}
        />
        <Box
          ref={listRef}
          sx={
            inExpansion ? { height: listContainerHeight, overflow: 'auto' } : {}
          }
        >
          <ChainList
            parentRef={listRef}
            chains={filteredChains}
            isLoading={isLoading}
            onSelect={onSelect ?? onSelectChainFallback}
            selectedChainId={selectedChainId}
            itemsSize={inExpansion ? 'small' : 'medium'}
            adjustForStickySearchInput={!inExpansion}
            hasSearchQuery={!!inputRef.current?.value}
          />
        </Box>
      </FullPageContainer>
    )
  }
)
