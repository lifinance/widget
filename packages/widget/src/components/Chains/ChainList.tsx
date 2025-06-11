import type { ExtendedChain } from '@lifi/sdk'
import { Skeleton } from '@mui/material'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SearchNotFound } from '../Search/SearchNotFound'
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style'

interface ChainListProps {
  chains: ExtendedChain[]
  onSelect: (chain: ExtendedChain) => void
  selectedChainId?: number
  inExpansion: boolean
  isLoading: boolean
}

export const ChainList = ({
  chains,
  onSelect,
  selectedChainId,
  inExpansion,
  isLoading,
}: ChainListProps) => {
  const { t } = useTranslation()

  const initialSelectedChainIdRef = useRef(selectedChainId)
  const sortedChains = useMemo(() => {
    const selectedChain = chains.find(
      (chain) => chain.id === initialSelectedChainIdRef.current
    )
    const otherChains = chains.filter(
      (chain) => chain.id !== initialSelectedChainIdRef.current
    )
    return selectedChain ? [selectedChain, ...otherChains] : chains
  }, [chains])

  const size = inExpansion ? 'small' : 'medium'

  if (isLoading) {
    return (
      <List size={size} disablePadding sx={{ cursor: 'default' }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <ListItemButton
            key={index}
            size={size}
            sx={{ pointerEvents: 'none' }}
          >
            <ListItemAvatar size={size}>
              <Skeleton
                variant="circular"
                width={size === 'small' ? 32 : 40}
                height={size === 'small' ? 32 : 40}
                sx={{ marginRight: 2 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton
                  variant="text"
                  width={'100%'}
                  height={size === 'small' ? 18 : 24}
                />
              }
              size={size}
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
        adjustForStickySearchInput={!inExpansion}
      />
    )
  }

  return (
    <List size={size} disablePadding>
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
  )
}
