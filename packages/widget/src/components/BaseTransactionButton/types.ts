import type { RouteExtended } from '@lifi/sdk'

export interface BaseTransactionButtonProps {
  onClick?(): void
  text?: string
  disabled?: boolean
  loading?: boolean
  route?: RouteExtended
}
