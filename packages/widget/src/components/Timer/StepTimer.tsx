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
}> = ({ step }) => {
  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED'
  ) {
    return null
  }

  if (!step.execution?.signedAt) {
    return null
  }

  return <ExecutionTimer expiryTimestamp={getExpiryTimestamp(step)} />
}

const ExecutionTimer = ({ expiryTimestamp }: { expiryTimestamp: Date }) => {
  const { i18n } = useTranslation()

  const [isExpired, setExpired] = useState(false)

  const { days, hours, minutes, seconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })

  const isTimerExpired = isExpired || (!minutes && !seconds)

  if (isTimerExpired) {
    return null
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
