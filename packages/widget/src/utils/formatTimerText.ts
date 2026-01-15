import { formatTimer } from './timer.js'

export interface FormatTimerTextParams {
  days: number
  hours: number
  minutes: number
  seconds: number
}

/**
 * Formats timer text with fallback for browsers without Intl.DurationFormat
 */
export const formatTimerText = ({
  days,
  hours,
  minutes,
  seconds,
}: FormatTimerTextParams): string => {
  const formattedTime =
    formatTimer({
      days,
      hours,
      minutes,
      seconds,
      locale: 'en',
    }) ||
    (hours > 0 || days > 0
      ? `${String(hours + days * 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)

  return formattedTime
}
