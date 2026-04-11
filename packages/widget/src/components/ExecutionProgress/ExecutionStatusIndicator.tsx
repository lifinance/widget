import type { RouteExtended } from '@lifi/sdk'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { IconCircle } from '../IconCircle/IconCircle.js'
import { TimerRing } from '../Timer/StepStatusTimer.js'

/**
 * Discriminator for the visual state of the execution indicator.
 *
 * `'success' | 'warning' | 'error' | 'info'` map to an {@link IconCircle}
 * of the corresponding status. `'timer'` maps to a {@link TimerRing}
 * showing the last step's countdown.
 */
export type ExecutionIconKey =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'timer'

/**
 * Resolves the visual state of the execution indicator from route + status.
 *
 * Used both to select the icon for rendering and as a stable discriminator
 * for animation keys (so motion layers can animate the indicator's swap
 * without re-deriving the logic).
 */
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
  if (route.steps.at(-1)?.execution?.status === 'ACTION_REQUIRED') {
    return 'info'
  }
  return 'timer'
}

interface ExecutionStatusIndicatorProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionStatusIndicator: React.FC<
  ExecutionStatusIndicatorProps
> = ({ route, status }) => {
  const key = resolveExecutionIconKey(route, status)
  if (key === 'timer') {
    return <TimerRing step={route.steps.at(-1)} />
  }
  return <IconCircle status={key} />
}
