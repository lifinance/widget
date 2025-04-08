import type { LiFiStepExtended } from '@lifi/sdk'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { formatTimer } from '../../utils/timer.js'
import { TimerContent } from './TimerContent.js'

const getExecutionProcess = (step: LiFiStepExtended) =>
  step.execution?.process.findLast(
    (process) =>
      process.type === 'SWAP' ||
      process.type === 'CROSS_CHAIN' ||
      process.type === 'RECEIVING_CHAIN'
  )

const getExpiryTimestamp = (step: LiFiStepExtended) =>
  new Date(
    (getExecutionProcess(step)?.startedAt ?? Date.now()) +
      step.estimate.executionDuration * 1000
  )

export const StepTimer: React.FC<{
  step: LiFiStepExtended
  hideInProgress?: boolean
}> = ({ step, hideInProgress }) => {
  const { i18n, t } = useTranslation()
  const { language } = useSettings(['language'])

  const [isExecutionStarted, setExecutionStarted] = useState(
    () => !!getExecutionProcess(step)
  )

  const [expiryTimestamp, setExpiryTimestamp] = useState(() =>
    getExpiryTimestamp(step)
  )

  const [isExpired, setExpired] = useState(false)

  const {
    seconds,
    minutes,
    days,
    hours,
    isRunning: isTimerRunning,
    pause,
    resume,
    restart,
  } = useTimer({
    autoStart: false,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })

  const isTimerExpired = isExpired || (!minutes && !seconds)

  useEffect(() => {
    const executionProcess = getExecutionProcess(step)
    if (!executionProcess) {
      return
    }

    if (isExecutionStarted && isExpired) {
      return
    }

    const isProcessStarted =
      executionProcess.status === 'STARTED' ||
      executionProcess.status === 'PENDING'

    const shouldRestart =
      !isExecutionStarted && isProcessStarted && !isTimerRunning

    const shouldPause =
      isExecutionStarted &&
      executionProcess.status === 'ACTION_REQUIRED' &&
      isTimerRunning

    const shouldStop =
      isExecutionStarted && executionProcess.status === 'FAILED'

    const shouldResume =
      isExecutionStarted && isProcessStarted && !isTimerRunning

    if (shouldRestart) {
      const newExpiryTimestamp = getExpiryTimestamp(step)
      setExecutionStarted(true)
      setExpiryTimestamp(newExpiryTimestamp)
      return restart(newExpiryTimestamp, true)
    }
    if (shouldPause) {
      return pause()
    }
    if (shouldResume) {
      return resume()
    }
    if (shouldStop) {
      setExecutionStarted(false)
      setExpired(false)
    }
  }, [
    isExecutionStarted,
    isTimerRunning,
    pause,
    step,
    resume,
    restart,
    isExpired,
  ])

  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED' ||
    (isTimerExpired && hideInProgress)
  ) {
    return null
  }

  if (!isExecutionStarted) {
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

  return isTimerExpired ? (
    t('main.inProgress')
  ) : (
    <TimerContent>
      {formatTimer({
        locale: language,
        days,
        hours,
        minutes,
        seconds,
      })}
    </TimerContent>
  )
}
