import type { ExtendedChain } from '@lifi/sdk'
import { Avatar, ListItemAvatar, debounce } from '@mui/material'
import { type FormEventHandler, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDefaultElementId } from '../../hooks/useDefaultElementId'
import { useScrollableContainer } from '../../hooks/useScrollableContainer'
import { FormKeyHelper, type FormType } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { FullPageContainer } from '../FullPageContainer'
import { ListItemButton } from '../ListItemButton'
import { ListItemText } from '../ListItemText'
import { StickySearchInput } from '../Search/SearchInput'
import { SearchList } from '../Search/SearchInput.style'
import { SearchNotFound } from '../Search/SearchNotFound'

interface SelectChainContentProps {
  formType: FormType
  onSelect: (chain: ExtendedChain) => void
}

export const SelectChainContent: React.FC<SelectChainContentProps> = ({
  formType,
  onSelect,
}) => {
  const [selectedChainId] = useFieldValues(FormKeyHelper.getChainKey(formType))

  const { chains } = useChainSelect(formType)
  const elementId = useDefaultElementId()
  const scrollableContainer = useScrollableContainer(elementId)

  const { t } = useTranslation()

  const [filteredChains, setFilteredChains] = useState<ExtendedChain[]>(
    chains ?? []
  )

  const handleSearchInputChange: FormEventHandler<HTMLInputElement> = (e) => {
    const value = (e.target as HTMLInputElement).value

    if (!value) {
      setFilteredChains(chains ?? [])
    } else {
      setFilteredChains(
        chains
          ? chains.filter((chain) =>
              chain.name.toLowerCase().includes(value.toLowerCase())
            )
          : []
      )
    }

    if (scrollableContainer) {
      scrollableContainer.scrollTop = 0
    }
  }

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250)

  return (
    <FullPageContainer disableGutters>
      <StickySearchInput
        onChange={debouncedSearchInputChange}
        placeholder={t('main.searchChains')}
      />
      {filteredChains.length ? (
        <SearchList>
          {filteredChains.map((chain) => (
            <ListItemButton
              key={chain.id}
              onClick={() => onSelect(chain)}
              selected={chain.id === selectedChainId}
            >
              <ListItemAvatar>
                <Avatar src={chain.logoURI} alt={chain.name}>
                  {chain.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={chain.name} />
            </ListItemButton>
          ))}
        </SearchList>
      ) : (
        <SearchNotFound
          message={t('info.message.emptyChainList')}
          adjustForStickySearchInput
        />
      )}
    </FullPageContainer>
  )
}
