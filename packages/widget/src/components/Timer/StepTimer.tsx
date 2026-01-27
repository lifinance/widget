import type { LiFiStepExtended } from '@lifi/sdk'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { formatTimer } from '../../utils/timer.js'
import { TimerContent } from './TimerContent.js'

const getExpiryTimestamp = (step: LiFiStepExtended) => {
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

const ExecutionTimer = ({
  expiryTimestamp,
  hideInProgress,
}: {
  expiryTimestamp: Date
  hideInProgress?: boolean
}) => {
  const { t, i18n } = useTranslation()

  const [isExpired, setExpired] = useState(false)

  const { days, hours, minutes, seconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })

  const isTimerExpired = isExpired || (!minutes && !seconds)

  if (isTimerExpired) {
    if (hideInProgress) {
      return null
    }
    return t('main.inProgress')
  }

  return (
    <TimerContent>
      {formatTimer({
        locale: i18n.language,
        days,
        hours,
        minutes,
        seconds,
      })}
    </TimerContent>
  )
}
