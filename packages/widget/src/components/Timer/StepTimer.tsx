import type { LiFiStepExtended } from '@lifi/sdk'
import type { JSX } from 'react'
import { useExecutionTimer } from '../../hooks/timer/useExecutionTimer.js'
import { TimerContent } from './TimerContent.js'

export const getExpiryTimestamp = (step: LiFiStepExtended): Date => {
  const execution = step?.execution
  if (!execution) {
    return new Date()
  }
  const expiry = new Date(
    (execution.signedAt ?? Date.now()) + step.estimate.executionDuration * 1000
  )
  return expiry
}

export const StepTimer: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED' ||
    !step.execution?.signedAt
  ) {
    return null
  }

  return <ExecutionTimer expiryTimestamp={getExpiryTimestamp(step)} />
}

export const ExecutionTimerText = ({
  expiryTimestamp,
}: {
  expiryTimestamp: Date
}): string | null => {
  const { formatted } = useExecutionTimer(expiryTimestamp)
  return formatted
}

export const ExecutionTimer = ({
  expiryTimestamp,
}: {
  expiryTimestamp: Date
}): JSX.Element | string | null => {
  const { formatted, isTimerExpired } = useExecutionTimer(expiryTimestamp)

  if (isTimerExpired) {
    return null
  }

  return <TimerContent>{formatted}</TimerContent>
}
