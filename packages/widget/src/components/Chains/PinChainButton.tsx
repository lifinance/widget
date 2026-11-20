import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import { IconButton, Tooltip } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'

interface PinChainButtonProps {
  isPinned: boolean
  onPin: () => void
}

export const pinButtonClassName = 'pin-button'
const animationDuration = 225

export const PinChainButton = ({
  isPinned,
  onPin,
}: PinChainButtonProps): JSX.Element => {
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

export const lockedPinIconClassName = 'locked-pin-icon'

interface LockedPinIconProps {
  tooltip?: string
}

// Users cannot unpin a config pin. The icon is not a button, so a click on it
// selects the chain row.
export const LockedPinIcon = ({ tooltip }: LockedPinIconProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Tooltip title={tooltip || t('tooltip.lockedPin')} enterNextDelay={100}>
      <PushPinIcon
        className={lockedPinIconClassName}
        // SvgIcon is aria-hidden by default, which hides the Tooltip aria-label.
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an svg element cannot become an img tag
        role="img"
        aria-hidden={false}
        sx={{
          position: 'absolute',
          top: 4,
          left: 4,
          height: 20,
          width: 20,
          color: 'text.secondary',
          opacity: 0.4,
        }}
      />
    </Tooltip>
  )
}
