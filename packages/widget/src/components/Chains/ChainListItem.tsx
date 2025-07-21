import type { ExtendedChain } from '@lifi/sdk'
import { Box, Slide } from '@mui/material'
import { memo, useRef, useState } from 'react'
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from './ChainList.style'
import { PinChainButton } from './PinChainButton'

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
    const container = useRef(null)
    const timeoutId = useRef<ReturnType<typeof setTimeout>>(undefined)
    const [showPin, setShowPin] = useState(false)

    const onMouseEnter = () => {
      timeoutId.current = setTimeout(() => {
        setShowPin(true)
      }, 350)
    }

    const onMouseLeave = () => {
      clearTimeout(timeoutId.current)
      if (showPin) {
        setShowPin(false)
      }
    }

    return (
      <ListItem
        ref={container}
        style={{
          height: `${size}px`,
          transform: `translateY(${start}px)`,
          padding: 0,
          overflow: 'hidden',
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        secondaryAction={
          withPin ? (
            isPinned ? (
              <PinChainButton
                isPinned={isPinned}
                onPin={() => onPin(chain.id)}
              />
            ) : (
              <Box
                style={{
                  position: 'relative',
                  height: 28,
                  width: 28,
                }}
              >
                <Slide
                  direction="up"
                  in={showPin}
                  container={container.current}
                  appear={false}
                  mountOnEnter
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}
                >
                  <Box>
                    <PinChainButton
                      isPinned={isPinned}
                      onPin={() => onPin(chain.id)}
                    />
                  </Box>
                </Slide>
              </Box>
            )
          ) : null
        }
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
