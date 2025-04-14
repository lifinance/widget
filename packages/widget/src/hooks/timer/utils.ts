export function getTimeFromSeconds(secs: number) {
  const totalSeconds = Math.ceil(secs)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
  }
}

export function getSecondsFromExpiry(expiry: Date, shouldRound?: boolean) {
  const now = new Date().getTime()
  const milliSecondsDistance = expiry.getTime() - now
  if (milliSecondsDistance > 0) {
    const val = milliSecondsDistance / 1000
    return shouldRound ? Math.round(val) : val
  }
  return 0
}

export function validateExpiryTimestamp(expiryTimestamp: Date) {
  const isValid = new Date(expiryTimestamp).getTime() > 0
  if (!isValid) {
    console.warn('useTimer Invalid expiryTimestamp settings', expiryTimestamp)
  }
  return isValid
}

export function validateOnExpire(onExpire: () => void) {
  const isValid = onExpire && typeof onExpire === 'function'
  if (onExpire && !isValid) {
    console.warn('useTimer Invalid onExpire settings function', onExpire)
  }
  return isValid
}

export function getDelayFromExpiryTimestamp(
  expiryTimestamp: Date,
  defaultDelay: number
) {
  if (!validateExpiryTimestamp(expiryTimestamp)) {
    return 0
  }

  const seconds = getSecondsFromExpiry(expiryTimestamp)
  const extraMilliSeconds = Math.floor((seconds - Math.floor(seconds)) * 1000)
  return extraMilliSeconds > 0 ? extraMilliSeconds : defaultDelay
}

// Timer Storage Helper
export const TimerStorage = {
  getStoredExpiry: (timerId: string): Date | null => {
    const stored = localStorage.getItem(`timer_${timerId}_expiry`)
    return stored ? new Date(Number.parseInt(stored, 10)) : null
  },

  getPauseTimestamp: (timerId: string): number | null => {
    const stored = localStorage.getItem(`timer_${timerId}_pauseTime`)
    return stored ? Number.parseInt(stored, 10) : null
  },

  setTimerData: (timerId: string, expiry: Date, pauseTime?: number) => {
    localStorage.setItem(`timer_${timerId}_expiry`, expiry.getTime().toString())
    if (pauseTime !== undefined) {
      localStorage.setItem(`timer_${timerId}_pauseTime`, pauseTime.toString())
    }
  },

  clearTimerData: (timerId: string) => {
    localStorage.removeItem(`timer_${timerId}_pauseTime`)
    localStorage.removeItem(`timer_${timerId}_expiry`)
  },
  clearPausedTimestamp: (timerId: string) => {
    localStorage.removeItem(`timer_${timerId}_pauseTime`)
  },
}
