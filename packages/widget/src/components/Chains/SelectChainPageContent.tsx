import type { ExtendedChain } from '@lifi/sdk'
import { Box } from '@mui/material'
import { type JSX, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useChainSearch } from '../../hooks/useChainSearch.js'
import { useListHeight } from '../../hooks/useListHeight.js'
import type { FormType } from '../../stores/form/types.js'
import { PageContainer } from '../PageContainer.js'
import { SearchInput } from '../Search/SearchInput.js'
import { ChainList } from './ChainList.js'

interface SelectChainPageContentProps {
  formType: FormType
  onSelect?: (chain: ExtendedChain) => void
}

export function SelectChainPageContent({
  formType,
  onSelect,
}: SelectChainPageContentProps): JSX.Element {
  const { t } = useTranslation()
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

  const { listHeight } = useListHeight({
    listParentRef: listRef,
    headerRef,
  })

  return (
    <PageContainer disableGutters>
      <Box ref={headerRef} sx={{ pb: 2, px: 3, pt: 1.5 }}>
        <SearchInput
          inputRef={inputRef}
          onChange={onChange}
          placeholder={t('main.searchNetwork')}
          size="medium"
          onClear={onClear}
          autoFocus
        />
      </Box>
      <Box ref={listRef} style={{ height: listHeight, overflow: 'auto' }}>
        <ChainList
          parentRef={listRef}
          formType={formType}
          chains={filteredChains}
          isLoading={isLoading}
          onSelect={onSelect ?? onSelectChainFallback}
          selectedChainId={selectedChainId}
          hasSearchQuery={!!inputRef.current?.value}
          inExpansion={false}
        />
      </Box>
    </PageContainer>
  )
}
