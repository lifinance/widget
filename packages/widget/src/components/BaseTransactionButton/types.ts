import type { RouteExtended } from '@lifi/sdk'
import type { SxProps, Theme } from '@mui/material'

export interface BaseTransactionButtonProps {
  onClick?(): void
  text?: string
  disabled?: boolean
  loading?: boolean
  route?: RouteExtended
  sx?: SxProps<Theme>
}
