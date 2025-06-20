import type { ExtendedChain } from '@lifi/sdk'
import { Box, debounce, useTheme } from '@mui/material'
import { type FormEventHandler, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultMaxHeight } from '../../config/constants'
import { useDefaultElementId } from '../../hooks/useDefaultElementId'
import { useScrollableContainer } from '../../hooks/useScrollableContainer'
import { FormKeyHelper, type FormType } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { FullPageContainer } from '../FullPageContainer'
import { SearchInput, StickySearchInput } from '../Search/SearchInput'
import { ChainList } from './ChainList'

interface SelectChainContentProps {
  formType: FormType
  onSelect: (chain: ExtendedChain | undefined) => void
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
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value
    setSearchQuery(value)

    if (scrollableContainer) {
      scrollableContainer.scrollTop = 0
    }
  }

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250)

  const listContainerHeight = useMemo(() => {
    const fullContainerHeight =
      theme.container?.maxHeight || theme.container?.height || defaultMaxHeight
    return `calc(${fullContainerHeight}px - ${searchHeaderHeight})`
  }, [theme.container])

  return (
    <FullPageContainer disableGutters>
      {inExpansion ? (
        <Box sx={{ pt: 3, pb: 2, px: 3, height: searchHeaderHeight }}>
          <SearchInput
            onChange={handleSearchInputChange}
            placeholder={t('main.searchChain')}
            size="small"
            iconPosition="start"
          />
        </Box>
      ) : (
        <StickySearchInput
          onChange={debouncedSearchInputChange}
          placeholder={t('main.searchChain')}
        />
      )}
      <Box
        sx={
          inExpansion ? { height: listContainerHeight, overflow: 'auto' } : {}
        }
      >
        <ChainList
          chains={chains || []}
          searchQuery={searchQuery}
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
