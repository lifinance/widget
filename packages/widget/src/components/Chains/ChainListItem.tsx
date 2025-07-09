import type { ExtendedChain } from '@lifi/sdk'
import { memo } from 'react'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style'

interface ChainListItemProps {
  chain: ExtendedChain
  onSelect: (chain: ExtendedChain) => void
  selected?: boolean
  itemsSize: 'small' | 'medium'
  size: number
  start: number
}

export const ChainListItem = memo(
  ({
    chain,
    onSelect,
    selected,
    itemsSize,
    size,
    start,
  }: ChainListItemProps) => {
    return (
      <ListItem
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
          padding: 0,
        }}
      >
        <ListItemButton
          onClick={() => onSelect(chain)}
          selected={selected}
          size={itemsSize}
        >
          <ListItemAvatar size={itemsSize}>
            <Avatar src={chain.logoURI} alt={chain.name} size={itemsSize}>
              {chain.name[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={chain.name} size={itemsSize} />
        </ListItemButton>
      </ListItem>
    )
  }
)
