import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { IconButton } from '@mui/material'
import type { JSX } from 'react'

interface PinChainButtonProps {
  isPinned: boolean
  isLocked?: boolean
  onPin: () => void
}

export const pinButtonClassName = 'pin-button'
const animationDuration = 225

export const PinChainButton = ({
  isPinned,
  isLocked,
  onPin,
}: PinChainButtonProps): JSX.Element => {
  const PinIcon = isPinned || isLocked ? PushPinIcon : PushPinOutlinedIcon
  return (
    <IconButton
      className={pinButtonClassName}
      edge="end"
      aria-label="pin"
      // Not `disabled`: it sets `pointer-events: none`, so the click would select the row.
      aria-disabled={isLocked ? 'true' : undefined}
      tabIndex={isLocked ? -1 : undefined}
      disableRipple={isLocked}
      onClick={(e) => {
        e.stopPropagation()
        if (!isLocked) {
          onPin()
        }
      }}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 28,
        width: 28,
        transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        ...(isPinned || isLocked
          ? {
              opacity: 1,
              transform: 'translateY(0)',
            }
          : {
              opacity: 0,
              transform: 'translateY(-50%)',
            }),
        ...(isLocked
          ? {
              cursor: 'default',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }
          : {}),
      }}
    >
      <PinIcon
        sx={{
          height: 20,
          width: 20,
          color: 'text.secondary',
        }}
      />
    </IconButton>
  )
}
