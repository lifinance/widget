import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import type { SvgIcon } from '@mui/material'
import type { StatusColor } from './IconCircle.style.js'

export const statusIcons: Record<StatusColor, typeof SvgIcon> = {
  success: Done,
  error: ErrorRounded,
  warning: WarningRounded,
  info: InfoRounded,
}
