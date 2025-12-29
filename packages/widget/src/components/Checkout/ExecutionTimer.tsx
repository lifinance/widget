import type { LiFiStepExtended } from '@lifi/sdk'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer'
import { formatTimer } from '../../utils/timer.js'
import { CircularProgress } from '../Step/CircularProgress'
import { TimerContent } from '../Timer/TimerContent.js'
import {
  TimerCircleContainer,
  TimerCircularProgress,
  //TimerText,
} from './StepExecution.style'

// ref: StepTimer
export const ExecutionTimer: React.FC<{
  step: LiFiStepExtended
  estimatedDuration: number
}> = ({ step, estimatedDuration }) => {
  const expiryTimestamp = new Date()
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + estimatedDuration)

  const { minutes, seconds } = useTimer({
    expiryTimestamp,
    autoStart: true,
  })

  // Calculate progress percentage (0-100)
  const totalSeconds = minutes * 60 + seconds
  const progress = (totalSeconds / estimatedDuration) * 100

  const execution = step?.execution
  if (!execution) {
    return null
  }

  // Format time as MM:SS
  // const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <TimerCircleContainer>
      <TimerCircularProgress
        variant="indeterminate"
        value={progress}
        size={120}
        thickness={3}
        sx={{
          transform: 'rotate(-90deg) !important',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      {estimatedDuration > 0 &&
      (execution.status === 'STARTED' || execution.status === 'PENDING') ? (
        // <TimerText>{formattedTime}</TimerText>
        <StepTimer step={step} />
      ) : (
        <CircularProgress execution={execution} />
      )}
    </TimerCircleContainer>
  )
}

/**
 * Checks if the execution has a main transaction type (SWAP, CROSS_CHAIN, or RECEIVING_CHAIN).
 * Used to determine if the main execution has started (not just token allowance).
 */
const hasMainExecutionStarted = (step: LiFiStepExtended) => {
  const type = step.execution?.type
  return type === 'SWAP' || type === 'CROSS_CHAIN' || type === 'RECEIVING_CHAIN'
}

/**
 * Calculates expiry timestamp based on process start time, estimated duration, and pause time.
 * Pause time is added when action is required (usually for signature requests).
 */
const getExpiryTimestamp = (step: LiFiStepExtended) => {
  const execution = step?.execution
  if (!execution) {
    return new Date()
  }
  let timeInPause = 0
  if (execution?.actionRequiredAt) {
    const actionDoneAt = execution.pendingAt ?? execution.doneAt ?? Date.now()
    timeInPause = new Date(actionDoneAt - execution.actionRequiredAt).getTime()
  }
  const expiry = new Date(
    (execution.startedAt ?? Date.now()) +
      step.estimate.executionDuration * 1000 +
      timeInPause
  )
  return expiry
}

export const StepTimer: React.FC<{
  step: LiFiStepExtended
  hideInProgress?: boolean
}> = ({ step, hideInProgress }) => {
  const { i18n } = useTranslation()
  const [isExpired, setExpired] = useState(false)
  const [isExecutionStarted, setExecutionStarted] = useState(() =>
    hasMainExecutionStarted(step)
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
    const execution = step?.execution
    if (!execution) {
      return
    }

    if (isExecutionStarted && isExpired) {
      return
    }

    const isProcessStarted =
      execution.status === 'STARTED' || execution.status === 'PENDING'

    const shouldRestart = !isExecutionStarted && isProcessStarted && !isRunning

    const shouldPause =
      isExecutionStarted &&
      (execution.status === 'ACTION_REQUIRED' ||
        execution.status === 'MESSAGE_REQUIRED' ||
        execution.status === 'RESET_REQUIRED') &&
      isRunning

    const shouldStop = isExecutionStarted && execution.status === 'FAILED'

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

  if (isTimerExpired) {
    return null
  }

  return (
    <TimerContent>
      {formatTimer({
        locale: 'en',
        days,
        hours,
        minutes,
        seconds,
      })}
    </TimerContent>
  )
}
