import type { RouteExtended } from '@lifi/sdk'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'

/** Visual state of the execution status indicator. */
export type ExecutionIconKey =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'timer'

/** Maps route execution state to an {@link ExecutionIconKey}. Pure function. */
export function resolveExecutionIconKey(
  route: RouteExtended,
  status: RouteExecutionStatus
): ExecutionIconKey {
  if (hasEnumFlag(status, RouteExecutionStatus.Done)) {
    return hasEnumFlag(status, RouteExecutionStatus.Partial) ||
      hasEnumFlag(status, RouteExecutionStatus.Refunded)
      ? 'warning'
      : 'success'
  }
  if (hasEnumFlag(status, RouteExecutionStatus.Failed)) {
    return 'error'
  }
  const activeStep =
    route.steps.find(
      (step) =>
        step.execution?.status === 'PENDING' ||
        step.execution?.status === 'ACTION_REQUIRED'
    ) ?? route.steps.at(-1)
  if (activeStep?.execution?.status === 'ACTION_REQUIRED') {
    return 'info'
  }
  return 'timer'
}
