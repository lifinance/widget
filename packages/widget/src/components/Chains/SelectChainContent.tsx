import type { ExtendedChain } from '@lifi/sdk'
import { debounce } from '@mui/material'
import { type FormEventHandler, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDefaultElementId } from '../../hooks/useDefaultElementId'
import { useScrollableContainer } from '../../hooks/useScrollableContainer'
import { FormKeyHelper, type FormType } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { useChainSelect } from '../ChainSelect/useChainSelect'
import { FullPageContainer } from '../FullPageContainer'
import { StickySearchInput } from '../Search/SearchInput'
import { SearchNotFound } from '../Search/SearchNotFound'
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './SelectChainContent.style'

interface SelectChainContentProps {
  formType: FormType
  onSelect: (chain: ExtendedChain) => void
  inExpansion: boolean
}

export const SelectChainContent: React.FC<SelectChainContentProps> = ({
  formType,
  onSelect,
  inExpansion,
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

  const size = inExpansion ? 'small' : 'regular'

  const debouncedSearchInputChange = debounce(handleSearchInputChange, 250)

  // On initial render, show selected chain first
  const initialSelectedChainIdRef = useRef(selectedChainId)
  const sortedChains = useMemo(() => {
    const selectedChain = filteredChains.find(
      (chain) => chain.id === initialSelectedChainIdRef.current
    )
    const otherChains = filteredChains.filter(
      (chain) => chain.id !== initialSelectedChainIdRef.current
    )
    return selectedChain ? [selectedChain, ...otherChains] : filteredChains
  }, [filteredChains])

  return (
    <FullPageContainer disableGutters>
      <StickySearchInput
        inExpansion={inExpansion}
        onChange={debouncedSearchInputChange}
        placeholder={t('main.searchChain')}
      />
      {sortedChains.length ? (
        <List size={size}>
          {sortedChains.map((chain) => (
            <ListItemButton
              key={chain.id}
              onClick={() => onSelect(chain)}
              selected={chain.id === selectedChainId}
              size={size}
            >
              <ListItemAvatar size={size}>
                <Avatar src={chain.logoURI} alt={chain.name} size={size}>
                  {chain.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={chain.name} size={size} />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <SearchNotFound
          message={t('info.message.emptyChainList')}
          adjustForStickySearchInput
        />
      )}
    </FullPageContainer>
  )
}
