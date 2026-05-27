import type { ExtendedChain } from '@lifi/sdk'
import { Box, useTheme } from '@mui/material'
import { type JSX, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChainSearch } from '../../hooks/useChainSearch.js'
import type { FormType } from '../../stores/form/types.js'
import { getWidgetMaxHeight } from '../../utils/widgetSize.js'
import { PageContainer } from '../PageContainer.js'
import { SearchInput } from '../Search/SearchInput.js'
import { ChainList } from './ChainList.js'

interface SelectChainExpansionContentProps {
  formType: FormType
  onSelect?: (chain: ExtendedChain) => void
}

export function SelectChainExpansionContent({
  formType,
  onSelect,
}: SelectChainExpansionContentProps): JSX.Element {
  const { t } = useTranslation()
  const theme = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const {
    filteredChains,
    isLoading,
    selectedChainId,
    onSelectChainFallback,
    onChange,
    onClear,
  } = useChainSearch(formType, listRef, inputRef)

  const [headerHeight, setHeaderHeight] = useState(0)

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
  }, [])

  const listContainerHeight = useMemo(() => {
    if (!headerHeight) {
      return undefined
    }
    const fullContainerHeight = getWidgetMaxHeight(theme)
    const value =
      typeof fullContainerHeight === 'number'
        ? `${fullContainerHeight}px`
        : fullContainerHeight
    return `calc(${value} - ${headerHeight}px)`
  }, [theme, headerHeight])

  return (
    <PageContainer disableGutters>
      <Box ref={headerRef} sx={{ pb: 2, px: 2.5, pt: 3 }}>
        <SearchInput
          inputRef={inputRef}
          onChange={onChange}
          placeholder={t('main.searchNetwork')}
          size="small"
          onClear={onClear}
        />
      </Box>
      <Box
        ref={listRef}
        style={{ height: listContainerHeight, overflow: 'auto' }}
      >
        <ChainList
          parentRef={listRef}
          formType={formType}
          chains={filteredChains}
          isLoading={isLoading}
          onSelect={onSelect ?? onSelectChainFallback}
          selectedChainId={selectedChainId}
          hasSearchQuery={!!inputRef.current?.value}
          inExpansion
        />
      </Box>
    </PageContainer>
  )
}
