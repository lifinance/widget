import type { LiFiStepExtended } from '@lifi/sdk'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { formatTimer, getExpiryTimestamp } from '../../utils/timer.js'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'
import { CircularProgressPending } from '../Step/CircularProgress.style.js'
import {
  ProgressFill,
  ProgressTrack,
  RingContainer,
  StatusCircle,
  TimerLabel,
} from './StepStatusTimer.style.js'

interface TimerRingProps {
  step?: LiFiStepExtended
  size?: number
  thickness?: number
  showLabel?: boolean
}

export const TimerRing: React.FC<TimerRingProps> = ({
  step,
  size = iconCircleSize,
  thickness = 2,
  showLabel = true,
}) => {
  const { i18n } = useTranslation()
  const [isExpired, setExpired] = useState(false)

  const signedAt = step?.execution?.signedAt
  const totalDuration = (step?.estimate.executionDuration ?? 0) * 1000
  const expiryTimestamp = getExpiryTimestamp(step)

  const { days, hours, minutes, seconds } = useTimer({
    autoStart: Boolean(signedAt),
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })

  const hasActiveCountdown =
    Boolean(signedAt) && !isExpired && (Boolean(minutes) || Boolean(seconds))

  const remaining = Math.max(expiryTimestamp.getTime() - Date.now(), 0)
  const countdownProgress =
    totalDuration > 0
      ? Math.min(((totalDuration - remaining) / totalDuration) * 100, 100)
      : 0

  return (
    <RingContainer sx={{ width: size, height: size }}>
      <ProgressTrack
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
      />
      {hasActiveCountdown ? (
        <ProgressFill
          variant="determinate"
          value={countdownProgress}
          size={size}
          thickness={thickness}
        />
      ) : (
        <CircularProgressPending size={size} />
      )}
      {showLabel && hasActiveCountdown ? (
        <StatusCircle>
          <TimerLabel>
            {formatTimer({
              locale: i18n.language,
              days,
              hours,
              minutes,
              seconds,
            })}
          </TimerLabel>
        </StatusCircle>
      ) : null}
    </RingContainer>
  )
}
