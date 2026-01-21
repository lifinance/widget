import type { LiFiStepExtended } from '@lifi/sdk'
import { useEffect, useState } from 'react'
import { getExpiryTimestamp } from '../utils/timer.js'
import { useTimer } from './timer/useTimer'

export interface UseExecutionTimerResult {
  days: number
  hours: number
  minutes: number
  seconds: number
  progress: number
  actionRequired: boolean
}

export const useExecutionTimer = (
  step: LiFiStepExtended
): UseExecutionTimerResult | null => {
  const execution = step?.execution
  const [isExecutionStarted, setExecutionStarted] = useState(() =>
    ['SWAP', 'CROSS_CHAIN', 'RECEIVING_CHAIN'].includes(execution?.type ?? '')
  )
  const [expiryTimestamp, setExpiryTimestamp] = useState(() =>
    getExpiryTimestamp(step)
  )

  const { days, hours, minutes, seconds, isRunning, pause, resume, restart } =
    useTimer({
      autoStart: false,
      expiryTimestamp,
    })

  const actionRequired =
    execution?.status === 'ACTION_REQUIRED' ||
    execution?.status === 'MESSAGE_REQUIRED' ||
    execution?.status === 'RESET_REQUIRED'

  useEffect(() => {
    if (!execution) {
      return
    }

    const isProcessStarted =
      execution.status === 'STARTED' || execution.status === 'PENDING'

    const shouldRestart = !isExecutionStarted && isProcessStarted && !isRunning

    const shouldPause = isExecutionStarted && actionRequired && isRunning

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
  }, [
    isExecutionStarted,
    isRunning,
    pause,
    restart,
    resume,
    step,
    execution,
    actionRequired,
  ])

  if (!execution) {
    return null
  }

  // Calculate progress
  const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds
  const estimatedDuration = step.estimate.executionDuration
  const progress =
    estimatedDuration > 0 ? 100 - (totalSeconds / estimatedDuration) * 100 : 0

  return {
    days,
    hours,
    minutes,
    seconds,
    progress,
    actionRequired,
  }
}
