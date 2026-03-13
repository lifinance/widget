import type { BoxProps } from '@mui/material'
import { useTheme } from '@mui/material'
import type { StatusColor } from './IconCircle.style.js'
import {
  getStatusColor,
  IconCircleRoot,
  iconCircleSize,
} from './IconCircle.style.js'
import { statusIcons } from './statusIcons.js'

interface IconCircleProps extends Omit<BoxProps, 'color'> {
  status: StatusColor
  size?: number
}

export const IconCircle: React.FC<IconCircleProps> = ({
  status,
  size = iconCircleSize,
  ...rest
}) => {
  const theme = useTheme()
  const colorConfig = getStatusColor(status, theme)
  const Icon = statusIcons[status]

  return (
    <IconCircleRoot colorConfig={colorConfig} circleSize={size} {...rest}>
      <Icon />
    </IconCircleRoot>
  )
}

export type { StatusColor } from './IconCircle.style.js'
export { iconCircleSize } from './IconCircle.style.js'
