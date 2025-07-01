import type { ExtendedChain } from '@lifi/sdk'
import { Box, debounce, useTheme } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDefaultElementId } from '../../hooks/useDefaultElementId'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { useScrollableContainer } from '../../hooks/useScrollableContainer'
import { FormKeyHelper, type FormType } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { formatSize } from '../../utils/format'
import { getWidgetMaxHeight } from '../../utils/widgetSize'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { FullPageContainer } from '../FullPageContainer'
import { SearchInput, StickySearchInput } from '../Search/SearchInput'
import { ChainList } from './ChainList'

interface SelectChainContentProps {
  formType: FormType
  onSelect: (chain: ExtendedChain) => void
  inExpansion: boolean
}

const searchHeaderHeight = '80px'

export const SelectChainContent: React.FC<SelectChainContentProps> = ({
  formType,
  onSelect,
  inExpansion,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { chains, isLoading } = useChainSelect(formType)
  const elementId = useDefaultElementId()
  const scrollableContainer = useScrollableContainer(elementId)
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType))
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const isActiveChainExpansion = useHasChainExpansion()
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

  const handleClear = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setFilteredChains(chains ?? [])
    scrollToTop()
  }, [chains, scrollToTop])

  useEffect(() => {
    if (!isActiveChainExpansion) {
      handleClear()
    }
  }, [isActiveChainExpansion, handleClear])

  const debouncedFilterChains = useMemo(
    () =>
      debounce((chains: ExtendedChain[]) => {
        const value = inputRef.current?.value?.toLowerCase() || ''
        const filtered = value
          ? chains?.filter((chain) => chain.name.toLowerCase().includes(value))
          : chains
        setFilteredChains(filtered ?? [])
        scrollToTop()
      }, 250),
    [scrollToTop]
  )

  useEffect(() => {
    // When chains are loaded or change, filter with current input value
    debouncedFilterChains(chains ?? [])
  }, [chains, debouncedFilterChains])

  const listContainerHeight = useMemo(() => {
    const fullContainerHeight = getWidgetMaxHeight(theme)
    const heightValue = formatSize(fullContainerHeight)
    return `calc(${heightValue} - ${searchHeaderHeight})`
  }, [theme])

  return (
    <FullPageContainer disableGutters>
      {inExpansion ? (
        <Box sx={{ pt: 3, pb: 2, px: 3, height: searchHeaderHeight }}>
          <SearchInput
            inputRef={inputRef}
            onChange={() => debouncedFilterChains(chains ?? [])}
            placeholder={t('main.searchChain')}
            size="small"
            onClear={handleClear}
          />
        </Box>
      ) : (
        <StickySearchInput
          inputRef={inputRef}
          onChange={() => debouncedFilterChains(chains ?? [])}
          placeholder={t('main.searchChain')}
          onClear={handleClear}
        />
      )}
      <Box
        ref={listRef}
        sx={
          inExpansion ? { height: listContainerHeight, overflow: 'auto' } : {}
        }
      >
        <ChainList
          chains={filteredChains}
          isLoading={isLoading}
          onSelect={onSelect}
          selectedChainId={selectedChainId}
          itemsSize={inExpansion ? 'small' : 'medium'}
          adjustForStickySearchInput={!inExpansion}
        />
      </Box>
    </FullPageContainer>
  )
}
