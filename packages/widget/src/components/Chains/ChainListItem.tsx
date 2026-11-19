import type { ExtendedChain } from '@lifi/sdk'
import { Box, type Theme } from '@mui/material'
import type React from 'react'
import { type JSX, memo } from 'react'
import type { ChainLabel } from '../../types/widget.js'
import { isVisibleChainLabel } from '../../utils/pinnedChains.js'
import {
  Avatar,
  ChainRowLabel,
  ChainRowLabelText,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style.js'
import { pinButtonClassName, PinChainButton } from './PinChainButton.js'

// Same inset as the chain logo (the ListItemButton left padding), so the label
// lines up with it.
const labelPositionSx = {
  small: {
    position: 'absolute',
    top: 6,
    left: (theme: Theme) => theme.spacing(1),
    maxWidth: (theme: Theme) => `calc(100% - ${theme.spacing(2)})`,
  },
  medium: {
    position: 'absolute',
    top: 8,
    left: (theme: Theme) => theme.spacing(1.5),
    maxWidth: (theme: Theme) => `calc(100% - ${theme.spacing(3)})`,
  },
} as const

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
      const visibleLabel = isVisibleChainLabel(label) ? label : undefined
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
            labeled={visibleLabel !== undefined}
          >
            <ListItemAvatar size={itemsSize}>
              <Avatar src={chain.logoURI} alt={chain.name} size={itemsSize}>
                {chain.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={chain.name} size={itemsSize} />
            {visibleLabel && (
              <ChainRowLabel
                className="chain-label"
                sx={[
                  labelPositionSx[itemsSize],
                  ...(Array.isArray(visibleLabel.sx)
                    ? visibleLabel.sx
                    : [visibleLabel.sx]),
                ]}
              >
                <ChainRowLabelText noWrap>
                  {visibleLabel.text.trim()}
                </ChainRowLabelText>
              </ChainRowLabel>
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
