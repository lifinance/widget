import type { LiFiStepExtended } from '@lifi/sdk'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { formatTimer } from '../../utils/timer.js'
import { TimerContent } from './TimerContent.js'

/**
 * Finds the most recent process that is either a SWAP, CROSS_CHAIN, or RECEIVING_CHAIN.
 * Includes RECEIVING_CHAIN to track the complete transaction lifecycle for UI updates.
 */
const getProgressProcess = (step: LiFiStepExtended) =>
  step.execution?.process.findLast(
    (process) =>
      process.type === 'SWAP' ||
      process.type === 'CROSS_CHAIN' ||
      process.type === 'RECEIVING_CHAIN'
  )

/**
 * Finds the most recent SWAP or CROSS_CHAIN process, excluding RECEIVING_CHAIN.
 * Expiry time is based on when the active transaction started, not the receiving phase.
 */
const getExpiryProcess = (step: LiFiStepExtended) =>
  step.execution?.process.findLast(
    (process) => process.type === 'SWAP' || process.type === 'CROSS_CHAIN'
  )

/**
 * Calculates expiry timestamp based on process start time, estimated duration, and pause time.
 * Pause time is added when action is required (usually for signature requests).
 */
const getExpiryTimestamp = (step: LiFiStepExtended) => {
  const lastProcess = getExpiryProcess(step)
  let timeInPause = 0
  if (lastProcess?.actionRequiredAt) {
    const actionDoneAt =
      lastProcess.pendingAt ?? lastProcess.doneAt ?? Date.now()
    timeInPause = new Date(
      actionDoneAt - lastProcess.actionRequiredAt
    ).getTime()
  }
  const expiry = new Date(
    (lastProcess?.startedAt ?? Date.now()) +
      step.estimate.executionDuration * 1000 +
      timeInPause
  )
  return expiry
}

export const StepTimer: React.FC<{
  step: LiFiStepExtended
  hideInProgress?: boolean
}> = ({ step, hideInProgress }) => {
  const { t, i18n } = useTranslation()
  const [isExpired, setExpired] = useState(false)
  const [isExecutionStarted, setExecutionStarted] = useState(
    () => !!getProgressProcess(step)
  )
  const [expiryTimestamp, setExpiryTimestamp] = useState(() =>
    getExpiryTimestamp(step)
  )
  const { days, hours, minutes, seconds, isRunning, pause, resume, restart } =
    useTimer({
      autoStart: false,
      expiryTimestamp,
      onExpire: () => setExpired(true),
    })

  useEffect(() => {
    const executionProcess = getProgressProcess(step)
    if (!executionProcess) {
      return
    }

    if (isExecutionStarted && isExpired) {
      return
    }

    const isProcessStarted =
      executionProcess.status === 'STARTED' ||
      executionProcess.status === 'PENDING'

    const shouldRestart = !isExecutionStarted && isProcessStarted && !isRunning

    const shouldPause =
      isExecutionStarted &&
      (executionProcess.status === 'ACTION_REQUIRED' ||
        executionProcess.status === 'MESSAGE_REQUIRED' ||
        executionProcess.status === 'RESET_REQUIRED') &&
      isRunning

    const shouldStop =
      isExecutionStarted && executionProcess.status === 'FAILED'

    const shouldResume = isExecutionStarted && isProcessStarted && !isRunning

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
  }, [isExecutionStarted, isExpired, isRunning, pause, restart, resume, step])

  const isTimerExpired = isExpired || (!minutes && !seconds)

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
        locale: i18n.language,
        days,
        hours,
        minutes,
        seconds,
      })}
    </TimerContent>
  )
}
