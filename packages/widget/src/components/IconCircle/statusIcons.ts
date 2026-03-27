import Done from '@mui/icons-material/Done'
import ErrorRounded from '@mui/icons-material/ErrorRounded'
import InfoRounded from '@mui/icons-material/InfoRounded'
import WarningRounded from '@mui/icons-material/WarningRounded'
import type { SvgIcon } from '@mui/material'

export type StatusIcon = 'success' | 'error' | 'warning' | 'info'

export const statusIcons: Record<StatusIcon, typeof SvgIcon> = {
  success: Done,
  error: ErrorRounded,
  warning: WarningRounded,
  info: InfoRounded,
}
