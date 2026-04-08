import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatTimer } from '../../utils/timer.js'
import { useTimer } from './useTimer.js'

export const useExecutionTimer = (
  expiryTimestamp: Date
): { formatted: string | null; isTimerExpired: boolean } => {
  const { i18n } = useTranslation()
  const [isExpired, setExpired] = useState(false)
  const { days, hours, minutes, seconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })
  const isTimerExpired = isExpired || (!minutes && !seconds)
  const formatted = isTimerExpired
    ? null
    : formatTimer({ locale: i18n.language, days, hours, minutes, seconds })
  return { formatted, isTimerExpired }
}
