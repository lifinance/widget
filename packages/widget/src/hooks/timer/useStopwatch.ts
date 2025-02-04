import { useCallback, useState } from 'react'
import { useInterval } from './useInterval.js'
import {
  getSecondsFromExpiry,
  getSecondsFromPrevTime,
  getTimeFromSeconds,
} from './utils.js'

interface UseStopwatchProps {
  offsetTimestamp: Date
  autoStart?: boolean
}

// This implementation was taken from the common js project - https://www.npmjs.com/package/react-timer-hook
// modified to work in the Widget codebase with Typescript
export function useStopwatch({
  autoStart,
  offsetTimestamp,
}: UseStopwatchProps) {
  const [passedSeconds, setPassedSeconds] = useState(
    getSecondsFromExpiry(offsetTimestamp, true) || 0
  )
  const [prevTime, setPrevTime] = useState(new Date())
  const [seconds, setSeconds] = useState(
    passedSeconds + getSecondsFromPrevTime(prevTime || 0, true)
  )
  const [isRunning, setIsRunning] = useState(autoStart)

  useInterval(
    () => {
      setSeconds(passedSeconds + getSecondsFromPrevTime(prevTime, true))
    },
    isRunning ? 1000 : 0
  )

  const start = useCallback(() => {
    const newPrevTime = new Date()
    setPrevTime(newPrevTime)
    setIsRunning(true)
    setSeconds(passedSeconds + getSecondsFromPrevTime(newPrevTime, true))
  }, [passedSeconds])

  const pause = useCallback(() => {
    setPassedSeconds(seconds)
    setIsRunning(false)
  }, [seconds])

  const reset = useCallback((offset = new Date(), newAutoStart = true) => {
    const newPassedSeconds = getSecondsFromExpiry(offset, true) || 0
    const newPrevTime = new Date()
    setPrevTime(newPrevTime)
    setPassedSeconds(newPassedSeconds)
    setIsRunning(newAutoStart)
    setSeconds(newPassedSeconds + getSecondsFromPrevTime(newPrevTime, true))
  }, [])

  return {
    ...getTimeFromSeconds(seconds),
    start,
    pause,
    reset,
    isRunning,
  }
}
