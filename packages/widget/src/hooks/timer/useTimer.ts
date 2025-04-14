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
}

// This implementation was taken from the common js project - https://www.npmjs.com/package/react-timer-hook
// modified to work in the Widget  codebase with Typescript
export function useTimer({
  expiryTimestamp: expiry,
  onExpire,
  autoStart = true,
}: UseTimerProps) {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry)
  const [seconds, setSeconds] = useState(() =>
    getSecondsFromExpiry(expiryTimestamp)
  )
  const [isRunning, setIsRunning] = useState(autoStart)
  const [didStart, setDidStart] = useState(autoStart)
  const [delay, setDelay] = useState(() =>
    getDelayFromExpiryTimestamp(expiryTimestamp, DEFAULT_DELAY)
  )

  const handleExpire = useCallback(() => {
    validateOnExpire(onExpire) && onExpire()
    setIsRunning(false)
    setDelay(0)
  }, [onExpire])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const restart = useCallback(
    (newExpiryTimestamp: Date, newAutoStart = true) => {
      setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp, DEFAULT_DELAY))
      setDidStart(newAutoStart)
      setIsRunning(newAutoStart)
      setExpiryTimestamp(newExpiryTimestamp)
      setSeconds(getSecondsFromExpiry(newExpiryTimestamp))
    },
    []
  )

  const resume = useCallback(() => {
    const time = new Date()
    time.setMilliseconds(time.getMilliseconds() + seconds * 1000)
    restart(time)
  }, [seconds, restart])

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
