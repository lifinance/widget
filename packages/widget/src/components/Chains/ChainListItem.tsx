import type { ExtendedChain } from '@lifi/sdk'
import { Box } from '@mui/material'
import { memo } from 'react'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style.js'
import { PinChainButton, pinButtonClassName } from './PinChainButton.js'

interface ChainListItemProps {
  chain: ExtendedChain
  onSelect: (chain: ExtendedChain) => void
  selected?: boolean
  itemsSize: 'small' | 'medium'
  size: number
  start: number
  isPinned: boolean
  onPin: (chainId: number) => void
  withPin: boolean
}

export const ChainListItem = memo(
  ({
    chain,
    onSelect,
    selected,
    itemsSize,
    size,
    start,
    isPinned,
    onPin,
    withPin,
  }: ChainListItemProps) => {
    return (
      <ListItem
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
          padding: 0,
          overflow: 'hidden',
        }}
        sx={{
          [`&:hover .${pinButtonClassName}`]: {
            opacity: 1,
            transform: 'translateY(0)',
          },
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
          {withPin && (
            <Box
              style={{
                position: 'relative',
                height: 28,
                width: 28,
              }}
            >
              <PinChainButton
                isPinned={isPinned}
                onPin={() => onPin(chain.id)}
              />
            </Box>
          )}
        </ListItemButton>
      </ListItem>
    )
  }
)
