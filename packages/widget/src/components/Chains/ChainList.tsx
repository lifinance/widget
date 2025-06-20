import type { ExtendedChain } from '@lifi/sdk'
import { Skeleton } from '@mui/material'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchNotFound } from '../Search/SearchNotFound'
import { AllChainsAvatar } from './AllChainsAvatar'
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style'

interface ChainListProps {
  chains: ExtendedChain[]
  searchQuery: string
  onSelect: (chain: ExtendedChain | undefined) => void
  selectedChainId?: number
  isLoading: boolean
  itemsSize: 'small' | 'medium'
  adjustForStickySearchInput?: boolean
}

export const ChainList = ({
  chains,
  searchQuery,
  onSelect,
  selectedChainId,
  isLoading,
  itemsSize,
  adjustForStickySearchInput,
}: ChainListProps) => {
  const { t } = useTranslation()

  const initialSelectedChainIdRef = useRef(selectedChainId)
  const sortedChains = useMemo(() => {
    const filteredChains = searchQuery
      ? chains.filter((chain) =>
          chain.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : chains

    const selectedChain = filteredChains.find(
      (chain) => chain.id === initialSelectedChainIdRef.current
    )
    const otherChains = filteredChains.filter(
      (chain) => chain.id !== initialSelectedChainIdRef.current
    )
    return selectedChain ? [selectedChain, ...otherChains] : filteredChains
  }, [chains, searchQuery])

  if (isLoading) {
    return (
      <List size={itemsSize} disablePadding sx={{ cursor: 'default' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListItemButton
            key={index}
            size={itemsSize}
            sx={{ pointerEvents: 'none' }}
          >
            <ListItemAvatar size={itemsSize}>
              <Skeleton
                variant="circular"
                width={itemsSize === 'small' ? 32 : 40}
                height={itemsSize === 'small' ? 32 : 40}
                sx={{ marginRight: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="text"
                  width={'100%'}
                  height={itemsSize === 'small' ? 18 : 24}
                />
              }
              size={itemsSize}
            />
          </ListItemButton>
        ))}
      </List>
    )
  }

  if (!sortedChains.length) {
    return (
      <SearchNotFound
        message={t('info.message.emptyChainList')}
        adjustForStickySearchInput={adjustForStickySearchInput}
      />
    )
  }

  return (
    <List className="long-list" size={itemsSize} disablePadding>
      {!searchQuery && (
        <ListItemButton
          onClick={() => onSelect(undefined)}
          selected={selectedChainId === undefined}
          size={itemsSize}
        >
          <ListItemAvatar size={itemsSize}>
            <AllChainsAvatar chains={chains} size={itemsSize} />
          </ListItemAvatar>
          <ListItemText primary={t('main.allChains')} size={itemsSize} />
        </ListItemButton>
      )}
      {sortedChains.map((chain) => (
        <ListItemButton
          key={chain.id}
          onClick={() => onSelect(chain)}
          selected={chain.id === selectedChainId}
          size={itemsSize}
        >
          <ListItemAvatar size={itemsSize}>
            <Avatar src={chain.logoURI} alt={chain.name} size={itemsSize}>
              {chain.name[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={chain.name} size={itemsSize} />
        </ListItemButton>
      ))}
    </List>
  )
}
