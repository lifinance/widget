import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { IconButton } from '@mui/material'

interface PinChainButtonProps {
  isPinned: boolean
  onPin: () => void
}

export const pinButtonClassName = 'pin-button'
const animationDuration = 225

export const PinChainButton = ({ isPinned, onPin }: PinChainButtonProps) => {
  const PinIcon = isPinned ? PushPinIcon : PushPinOutlinedIcon
  return (
    <IconButton
      className={pinButtonClassName}
      edge="end"
      aria-label="pin"
      onClick={(e) => {
        e.stopPropagation()
        onPin()
      }}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 28,
        width: 28,
        transition: `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        ...(isPinned
          ? {
              opacity: 1,
              transform: 'translateY(0)',
            }
          : {
              opacity: 0,
              transform: 'translateY(-50%)',
            }),
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
