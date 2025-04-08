import type { LiFiStepExtended } from '@lifi/sdk'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { formatTimer } from '../../utils/timer.js'
import { TimerContent } from './TimerContent.js'

const getExecutionProcess = (step: LiFiStepExtended) =>
  step.execution?.process.at(-1)

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
    expiryTimestamp: getExpiryTimestamp(step),
    onExpire() {
      setExpired(true)
    },
  })

  const isTimerExpired = isExpired || (!minutes && !seconds)

  useEffect(() => {
    const executionProcess = getExecutionProcess(step)
    if (!executionProcess) {
      return
    }

    const isProcessStarted =
      executionProcess.status === 'STARTED' ||
      executionProcess.status === 'PENDING'

    // timer should start if execution has not started but process has started
    const shouldRestart = !isExecutionStarted && isProcessStarted

    // timer should pause if execution has started and process fails or user action is required
    const shouldPause =
      isExecutionStarted && executionProcess.status === 'ACTION_REQUIRED'

    // timer should stop when execution starts and process fails
    const shouldStop =
      isExecutionStarted && executionProcess.status === 'FAILED'

    // should resume if execution has started and process status is started or pending and timer is not running
    const shouldResume =
      isExecutionStarted && isProcessStarted && !isTimerRunning

    if (shouldRestart) {
      const newExpiryTimestamp = getExpiryTimestamp(step)
      setExecutionStarted(true)
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
  }, [isExecutionStarted, isTimerRunning, pause, step, resume, restart])

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
