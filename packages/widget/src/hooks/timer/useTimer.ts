import { useCallback, useState } from 'react'
import { useInterval } from './useInterval.js'
import {
  getDelayFromExpiryTimestamp,
  getSecondsFromExpiry,
  getTimeFromSeconds,
  validateOnExpire,
} from './utils.js'

const DEFAULT_DELAY = 1000

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
      const stored = localStorage.getItem(`timer_${timerId}_expiry`)
      return stored ? new Date(Number.parseInt(stored, 10)) : expiry
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

  const [pauseTimestamp, setPauseTimestamp] = useState<number | null>(() => {
    if (timerId) {
      const stored = localStorage.getItem(`timer_${timerId}_pauseTime`)
      return stored ? Number.parseInt(stored, 10) : null
    }
    return null
  })

  const handleExpire = useCallback(() => {
    if (timerId) {
      localStorage.removeItem(`timer_${timerId}_totalPause`)
      localStorage.removeItem(`timer_${timerId}_pauseStart`)
      localStorage.removeItem(`timer_${timerId}_remainingTime`)
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
      localStorage.setItem(`timer_${timerId}_pauseTime`, now.toString())
      localStorage.setItem(
        `timer_${timerId}_expiry`,
        expiryTimestamp.getTime().toString()
      )
    }
  }, [timerId, expiryTimestamp])

  const restart = useCallback(
    (newExpiryTimestamp: Date, newAutoStart = true) => {
      if (timerId) {
        localStorage.removeItem(`timer_${timerId}_pauseTime`)
        setPauseTimestamp(null)
        localStorage.setItem(
          `timer_${timerId}_expiry`,
          newExpiryTimestamp.getTime().toString()
        )
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
      const storedExpiry = localStorage.getItem(`timer_${timerId}_expiry`)
      if (storedExpiry) {
        const newExpiryTimestamp = new Date(
          Number.parseInt(storedExpiry, 10) + pauseDuration
        )
        setExpiryTimestamp(newExpiryTimestamp)
        localStorage.setItem(
          `timer_${timerId}_expiry`,
          newExpiryTimestamp.getTime().toString()
        )
        setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp, DEFAULT_DELAY))
      }
      setPauseTimestamp(null)
      localStorage.removeItem(`timer_${timerId}_pauseTime`)
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
