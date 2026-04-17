import type { RouteExtended } from '@lifi/sdk'
import type { RouteExecutionStatus } from '../../stores/routes/types.js'

export interface TransactionStatusCardProps {
  /** The route being executed — drives icon, title, action rows, and bottom card. */
  route: RouteExtended
  /** Bitwise RouteExecutionStatus from the project's store. */
  status: RouteExecutionStatus
  /**
   * Optional override for the subtitle (description) text. Storybook and
   * demo-only escape hatch — when set, replaces the message derived from
   * {@link useRouteExecutionMessage}. Production code should leave this
   * undefined.
   */
  subtitleOverride?: string
}
