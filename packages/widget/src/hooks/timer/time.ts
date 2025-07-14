export type TimeFromMillisecondsType = {
  totalMilliseconds: number
  totalSeconds: number
  milliseconds: number
  seconds: number
  minutes: number
  hours: number
  days: number
}

export type AMPMType = '' | 'pm' | 'am'

export type FormattedTimeFromMillisecondsType = {
  milliseconds: number
  seconds: number
  minutes: number
  hours: number
  ampm?: AMPMType
}

export function getTimeFromMilliseconds(
  millisecs: number,
  isCountDown = true
): TimeFromMillisecondsType {
  const totalSeconds = isCountDown
    ? Math.ceil(millisecs / 1000)
    : Math.floor(millisecs / 1000)
  const days = Math.floor(totalSeconds / (60 * 60 * 24))
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
  const seconds = Math.floor(totalSeconds % 60)
  const milliseconds = Math.floor(millisecs % 1000)

  return {
    totalMilliseconds: millisecs,
    totalSeconds,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
  }
}

export function getMillisecondsFromExpiry(expiry: Date): number {
  const now = Date.now()
  const milliSecondsDistance = expiry?.getTime() - now
  return milliSecondsDistance > 0 ? milliSecondsDistance : 0
}
