import type { RouteExtended } from '@lifi/sdk'
import type { RouteExecutionStatus } from '../../stores/routes/types.js'

export interface TransactionStatusCardProps {
  /** The route being executed — drives icon, title, action rows, and bottom card. */
  route: RouteExtended
  /** Bitwise RouteExecutionStatus from the project's store. */
  status: RouteExecutionStatus
  /** Multiplier for all animation durations. 1 = normal, 3-5 = slow-motion. */
  timeScale?: number
}
