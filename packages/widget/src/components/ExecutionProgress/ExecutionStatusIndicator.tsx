import type { RouteExtended } from '@lifi/sdk'
import { RouteExecutionStatus } from '../../stores/routes/types.js'
import { hasEnumFlag } from '../../utils/enum.js'
import { IconCircle } from '../IconCircle/IconCircle.js'
import { TimerRing } from '../Timer/StepStatusTimer.js'

interface ExecutionStatusIndicatorProps {
  route: RouteExtended
  status: RouteExecutionStatus
}

export const ExecutionStatusIndicator: React.FC<
  ExecutionStatusIndicatorProps
> = ({ route, status }) => {
  const step = route.steps.at(-1)

  if (hasEnumFlag(status, RouteExecutionStatus.Done)) {
    if (
      hasEnumFlag(status, RouteExecutionStatus.Partial) ||
      hasEnumFlag(status, RouteExecutionStatus.Refunded)
    ) {
      return <IconCircle status="warning" />
    }
    return <IconCircle status="success" />
  }

  if (hasEnumFlag(status, RouteExecutionStatus.Failed)) {
    return <IconCircle status="error" />
  }

  if (step?.execution?.status === 'ACTION_REQUIRED') {
    return <IconCircle status="info" />
  }

  return <TimerRing step={step} />
}
