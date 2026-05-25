import type { ExtendedChain } from '@lifi/sdk'
import { Box, debounce, useTheme } from '@mui/material'
import type React from 'react'
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormKeyHelper, type FormType } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { getWidgetMaxHeight } from '../../utils/widgetSize.js'
import { useChainSelect } from '../ChainSelect/useChainSelect.js'
import { PageContainer } from '../PageContainer.js'
import { SearchInput } from '../Search/SearchInput.js'
import { ChainList } from './ChainList.js'

interface SelectChainContentProps {
  formType: FormType
  onSelect?: (chain: ExtendedChain) => void
  inExpansion: boolean
}

const searchHeaderHeight = '80px'

export const SelectChainContent: React.NamedExoticComponent<SelectChainContentProps> =
  memo(function SelectChainContent({
    formType,
    onSelect,
    inExpansion,
  }: SelectChainContentProps) {
    const theme = useTheme()
    const { chains, isLoading, setCurrentChain } = useChainSelect(formType)
    const { t } = useTranslation()
    const [selectedChainId] = useFieldValues(
      FormKeyHelper.getChainKey(formType)
    )
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const [debouncedSearchValue, setDebouncedSearchValue] = useState('')

    const filteredChains = useMemo(() => {
      const value = debouncedSearchValue.toLowerCase()
      return value
        ? (chains?.filter((chain) =>
            chain.name.toLowerCase().includes(value)
          ) ?? [])
        : (chains ?? [])
    }, [chains, debouncedSearchValue])

    const scrollToTop = useCallback(() => {
      listRef.current?.scrollTo(0, 0)
    }, [])

    const debouncedFilterChains = useMemo(
      () =>
        debounce((value: string) => {
          setDebouncedSearchValue(value)
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
      const value = inputRef.current?.value || ''
      debouncedFilterChains(value)
    }, [debouncedFilterChains])

    const onClear = useCallback(() => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setDebouncedSearchValue('')
      scrollToTop()
    }, [scrollToTop])

    const listContainerHeight = useMemo(() => {
      const fullContainerHeight = getWidgetMaxHeight(theme)
      const heightValue =
        typeof fullContainerHeight === 'number'
          ? `${fullContainerHeight}px`
          : fullContainerHeight
      return `calc(${heightValue} - ${searchHeaderHeight})`
    }, [theme])

    return (
      <PageContainer disableGutters>
        <Box
          sx={{
            pb: 2,
            px: inExpansion ? 2.5 : 3,
            pt: inExpansion ? 3 : 0,
          }}
        >
          <SearchInput
            inputRef={inputRef}
            onChange={onChange}
            placeholder={t('main.searchNetwork')}
            size={inExpansion ? 'small' : 'medium'}
            onClear={onClear}
            autoFocus={!inExpansion}
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
            inExpansion={inExpansion}
          />
        </Box>
      </PageContainer>
    )
  })
