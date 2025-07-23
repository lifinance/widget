import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { IconButton } from '@mui/material'

interface PinChainButtonProps {
  isPinned: boolean
  onPin: () => void
}

export const PinChainButton = ({ isPinned, onPin }: PinChainButtonProps) => {
  const PinIcon = isPinned ? PushPinIcon : PushPinOutlinedIcon
  return (
    <IconButton
      edge="end"
      aria-label="pin"
      onClick={(e) => {
        e.stopPropagation()
        onPin()
      }}
      sx={{
        height: 28,
        width: 28,
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
