import type { LiFiStepExtended } from '@lifi/sdk'
import { IconCircle } from '../IconCircle/IconCircle.js'
import { IndeterminateRing, TimerRing } from '../Timer/StepStatusTimer.js'

interface StepStatusIndicatorProps {
  step: LiFiStepExtended
}

export const StepStatusIndicator: React.FC<StepStatusIndicatorProps> = ({
  step,
}) => {
  const lastAction = step.execution?.actions?.at(-1)

  const status = lastAction?.status || 'PENDING'
  const substatus = lastAction?.substatus

  switch (status) {
    case 'STARTED':
    case 'PENDING': {
      if (!step.execution?.signedAt) {
        return <IndeterminateRing />
      }
      return <TimerRing step={step} />
    }
    case 'ACTION_REQUIRED':
    case 'MESSAGE_REQUIRED':
    case 'RESET_REQUIRED':
      return <IconCircle status="info" />
    case 'DONE':
      if (substatus === 'PARTIAL' || substatus === 'REFUNDED') {
        return <IconCircle status="warning" />
      }
      return <IconCircle status="success" />
    case 'FAILED':
      return <IconCircle status="error" />
  }
}
