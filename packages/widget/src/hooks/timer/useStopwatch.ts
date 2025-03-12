import { useCallback, useState } from 'react'
import { useInterval } from './useInterval.js'
import { getSecondsFromPrevTime, getTimeFromSeconds } from './utils.js'

const DEFAULT_DELAY = 1000

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
    getSecondsFromPrevTime(offsetTimestamp, true) || 0
  )
  const [prevTime, setPrevTime] = useState(new Date())
  const [seconds, setSeconds] = useState(
    passedSeconds + getSecondsFromPrevTime(prevTime, true)
  )
  const [isRunning, setIsRunning] = useState(autoStart)

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

  const reset = useCallback(
    (offset = offsetTimestamp, newAutoStart = true) => {
      const newPassedSeconds = getSecondsFromPrevTime(offset, true) || 0
      const newPrevTime = new Date()
      setPrevTime(newPrevTime)
      setPassedSeconds(newPassedSeconds)
      setIsRunning(newAutoStart)
      setSeconds(newPassedSeconds + getSecondsFromPrevTime(newPrevTime, true))
    },
    [offsetTimestamp]
  )

  useInterval(
    () => {
      setSeconds(passedSeconds + getSecondsFromPrevTime(prevTime, true))
    },
    isRunning ? DEFAULT_DELAY : 0
  )

  return {
    ...getTimeFromSeconds(seconds),
    start,
    pause,
    reset,
    isRunning,
  }
}
