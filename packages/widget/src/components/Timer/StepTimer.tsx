import type { LiFiStepExtended } from '@lifi/sdk'
import { useTranslation } from 'react-i18next'
import { useExecutionTimer } from '../../hooks/timer/useExecutionTimer.js'
import { TimerContent } from './TimerContent.js'

export const getExpiryTimestamp = (step: LiFiStepExtended) => {
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
  hideInProgress?: boolean
}> = ({ step, hideInProgress }) => {
  const { i18n } = useTranslation()

  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED'
  ) {
    return null
  }

  if (!step.execution?.signedAt) {
    const showSeconds = step.estimate.executionDuration < 60
    const duration = showSeconds
      ? Math.floor(step.estimate.executionDuration)
      : Math.floor(step.estimate.executionDuration / 60)
    return (
      <TimerContent>
        {duration.toLocaleString(i18n.language, {
          style: 'unit',
          unit: showSeconds ? 'second' : 'minute',
          unitDisplay: 'narrow',
        })}
      </TimerContent>
    )
  }

  return (
    <ExecutionTimer
      expiryTimestamp={getExpiryTimestamp(step)}
      hideInProgress={hideInProgress}
    />
  )
}

export const ExecutionTimerText = ({
  expiryTimestamp,
}: {
  expiryTimestamp: Date
}) => {
  const { formatted } = useExecutionTimer(expiryTimestamp)
  return formatted
}

export const ExecutionTimer = ({
  expiryTimestamp,
  hideInProgress,
}: {
  expiryTimestamp: Date
  hideInProgress?: boolean
}) => {
  const { t } = useTranslation()
  const { formatted, isTimerExpired } = useExecutionTimer(expiryTimestamp)

  if (isTimerExpired) {
    if (hideInProgress) {
      return null
    }
    return t('main.inProgress')
  }

  return <TimerContent>{formatted}</TimerContent>
}
