import { useCallback, useState } from 'react'
import { useInterval } from './useInterval.js'
import {
  TimerStorage,
  getDelayFromExpiryTimestamp,
  getSecondsFromExpiry,
  getTimeFromSeconds,
  validateOnExpire,
} from './utils.js'

// Constants
const DEFAULT_DELAY = 1000

// Types
interface UseTimerProps {
  expiryTimestamp: Date
  onExpire: () => void
  autoStart?: boolean
  timerId?: string
}

// This implementation was taken from the common js project - https://www.npmjs.com/package/react-timer-hook
// modified to work in the Widget codebase with Typescript
export function useTimer({
  expiryTimestamp: expiry,
  onExpire,
  autoStart = true,
  timerId,
}: UseTimerProps) {
  const [expiryTimestamp, setExpiryTimestamp] = useState(() => {
    if (timerId) {
      return TimerStorage.getStoredExpiry(timerId) ?? expiry
    }
    return expiry
  })

  const [seconds, setSeconds] = useState(() =>
    getSecondsFromExpiry(expiryTimestamp)
  )
  const [isRunning, setIsRunning] = useState(autoStart)
  const [didStart, setDidStart] = useState(autoStart)
  const [delay, setDelay] = useState(() =>
    getDelayFromExpiryTimestamp(expiryTimestamp, DEFAULT_DELAY)
  )
  const [pauseTimestamp, setPauseTimestamp] = useState<number | null>(() =>
    timerId ? TimerStorage.getPauseTimestamp(timerId) : null
  )

  const handleExpire = useCallback(() => {
    if (timerId) {
      TimerStorage.clearTimerData(timerId)
    }
    validateOnExpire(onExpire) && onExpire()
    setIsRunning(false)
    setDelay(0)
  }, [onExpire, timerId])

  const pause = useCallback(() => {
    setIsRunning(false)
    if (timerId) {
      const now = Date.now()
      setPauseTimestamp(now)
      TimerStorage.setTimerData(timerId, expiryTimestamp, now)
    }
  }, [timerId, expiryTimestamp])

  const restart = useCallback(
    (newExpiryTimestamp: Date, newAutoStart = true) => {
      if (timerId) {
        setPauseTimestamp(null)
        TimerStorage.setTimerData(timerId, newExpiryTimestamp)
      }
      setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp, DEFAULT_DELAY))
      setDidStart(newAutoStart)
      setIsRunning(newAutoStart)
      setExpiryTimestamp(newExpiryTimestamp)
      setSeconds(getSecondsFromExpiry(newExpiryTimestamp))
    },
    [timerId]
  )

  const resume = useCallback(() => {
    if (timerId && pauseTimestamp) {
      const pauseDuration = Date.now() - pauseTimestamp
      const storedExpiry = TimerStorage.getStoredExpiry(timerId)
      if (storedExpiry) {
        const newExpiryTimestamp = new Date(
          storedExpiry.getTime() + pauseDuration
        )
        setExpiryTimestamp(newExpiryTimestamp)
        TimerStorage.setTimerData(timerId, newExpiryTimestamp)
        setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp, DEFAULT_DELAY))
      }
      setPauseTimestamp(null)
      TimerStorage.clearPausedTimestamp(timerId)
    }
    setIsRunning(true)
  }, [timerId, pauseTimestamp])

  const start = useCallback(() => {
    if (didStart) {
      setSeconds(getSecondsFromExpiry(expiryTimestamp))
      setIsRunning(true)
    } else {
      resume()
    }
  }, [expiryTimestamp, didStart, resume])

  useInterval(
    () => {
      if (delay !== DEFAULT_DELAY) {
        setDelay(DEFAULT_DELAY)
      }
      const secondsValue = getSecondsFromExpiry(expiryTimestamp)
      setSeconds(secondsValue)
      if (secondsValue <= 0) {
        handleExpire()
      }
    },
    isRunning ? delay : 0
  )

  return {
    ...getTimeFromSeconds(seconds),
    start,
    pause,
    resume,
    restart,
    isRunning,
  }
}
