import { useCallback, useEffect, useState } from 'react'
import {
  getMillisecondsFromExpiry,
  getTimeFromMilliseconds,
  type TimeFromMillisecondsType,
} from './time.js'
import { useInterval } from './useInterval.js'
import { validateExpiryTimestamp, validateOnExpire } from './validate.js'

const SECOND_INTERVAL = 1000

type useTimerSettingsType = {
  expiryTimestamp: Date
  onExpire?: () => void
  autoStart?: boolean
  interval?: number
}

type useTimerResultType = TimeFromMillisecondsType & {
  start: () => void
  pause: () => void
  resume: () => void
  restart: (newExpiryTimestamp: Date, newAutoStart?: boolean) => void
  isRunning: boolean
}

/**
 * `useTimer` from https://github.com/amrlabib/react-timer-hook
 */
export function useTimer({
  expiryTimestamp: expiry,
  onExpire = () => {},
  autoStart = true,
  interval: customInterval = SECOND_INTERVAL,
}: useTimerSettingsType): useTimerResultType {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry)
  const [milliseconds, setMilliseconds] = useState(
    getMillisecondsFromExpiry(expiryTimestamp)
  )
  const [isRunning, setIsRunning] = useState(autoStart)
  const [didStart, setDidStart] = useState(autoStart)
  const [interval, setInterval] = useState<number | null>(customInterval)

  const handleExpire = useCallback(() => {
    if (validateOnExpire(onExpire)) {
      onExpire()
    }
    setIsRunning(false)
    setInterval(null)
  }, [onExpire])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const restart = useCallback(
    (newExpiryTimestamp: Date, newAutoStart = true) => {
      setInterval(customInterval)
      setDidStart(newAutoStart)
      setIsRunning(newAutoStart)
      setExpiryTimestamp(newExpiryTimestamp)
      setMilliseconds(getMillisecondsFromExpiry(newExpiryTimestamp))
    },
    [customInterval]
  )

  const resume = useCallback(() => {
    const time = new Date()
    time.setMilliseconds(time.getMilliseconds() + milliseconds)
    restart(time)
  }, [milliseconds, restart])

  const start = useCallback(() => {
    if (didStart) {
      setMilliseconds(getMillisecondsFromExpiry(expiryTimestamp))
      setIsRunning(true)
    } else {
      resume()
    }
  }, [expiryTimestamp, didStart, resume])

  useInterval(
    () => {
      const millisecondsValue = getMillisecondsFromExpiry(expiryTimestamp)
      setMilliseconds(millisecondsValue)
      if (millisecondsValue <= 0) {
        handleExpire()
      } else if (interval && millisecondsValue < interval) {
        setInterval(millisecondsValue)
      }
    },
    isRunning ? interval : null
  )

  useEffect(() => {
    validateExpiryTimestamp(expiryTimestamp)
  }, [expiryTimestamp])

  return {
    ...getTimeFromMilliseconds(milliseconds),
    start,
    pause,
    resume,
    restart,
    isRunning,
  }
}
