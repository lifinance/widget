import type { ExtendedChain } from '@lifi/sdk'
import { Box } from '@mui/material'
import type React from 'react'
import { type JSX, memo } from 'react'
import type { ChainLabel } from '../../types/widget.js'
import { isVisibleChainLabel } from '../../utils/pinnedChains.js'
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style.js'
import { pinButtonClassName, PinChainButton } from './PinChainButton.js'

// The label shrinks first (its text gets the ellipsis) down to `minWidth`.
// Only then does the chain name shrink and get the ellipsis.
const labelLayoutSx = {
  flexShrink: 1000,
  minWidth: 48,
  marginLeft: 1,
}

interface ChainListItemProps {
  chain: ExtendedChain
  onSelect: (chain: ExtendedChain) => void
  selected?: boolean
  itemsSize: 'small' | 'medium'
  size: number
  start: number
  isPinned: boolean
  isLocked: boolean
  label?: ChainLabel
  onPin: (chainId: number) => void
  withPin: boolean
}

export const ChainListItem: React.NamedExoticComponent<ChainListItemProps> =
  memo(
    ({
      chain,
      onSelect,
      selected,
      itemsSize,
      size,
      start,
      isPinned,
      isLocked,
      label,
      onPin,
      withPin,
    }: ChainListItemProps): JSX.Element => {
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
            <ListItemText
              primary={chain.name}
              size={itemsSize}
              sx={{ minWidth: 0 }}
            />
            {isVisibleChainLabel(label) && (
              <CardLabel
                className="chain-label"
                sx={[
                  labelLayoutSx,
                  ...(Array.isArray(label.sx) ? label.sx : [label.sx]),
                ]}
              >
                <CardLabelTypography noWrap>
                  {label.text.trim()}
                </CardLabelTypography>
              </CardLabel>
            )}
            {withPin && (
              <Box
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  height: 28,
                  width: 28,
                }}
              >
                <PinChainButton
                  isPinned={isPinned}
                  isLocked={isLocked}
                  onPin={() => onPin(chain.id)}
                />
              </Box>
            )}
          </ListItemButton>
        </ListItem>
      )
    }
  )
