import type { ExecutionActionStatus, Substatus } from '@lifi/sdk'
import type { Theme } from '@mui/material'

/**
 * Gets the background color for a status circle based on execution status
 * @param theme - Material-UI theme
 * @param status - Execution status
 * @param substatus - Optional substatus for DONE status
 * @returns RGBA color string
 */
export const getStatusColor = (
  theme: Theme,
  status?: ExecutionActionStatus,
  substatus?: Substatus
): string => {
  switch (status) {
    case 'ACTION_REQUIRED':
    case 'MESSAGE_REQUIRED':
    case 'RESET_REQUIRED':
      return `rgba(${theme.vars.palette.info.mainChannel} / 0.12)`
    case 'DONE':
      if (substatus === 'PARTIAL' || substatus === 'REFUNDED') {
        return `rgba(${theme.vars.palette.warning.mainChannel} / 0.12)`
      }
      return `rgba(${theme.vars.palette.success.mainChannel} / 0.12)`
    case 'FAILED':
      return `rgba(${theme.vars.palette.error.mainChannel} / 0.12)`
    default:
      return theme.vars.palette.info.mainChannel
  }
}
