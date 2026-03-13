import type { LiFiStepExtended } from '@lifi/sdk'
import { CircularProgress as MuiCircularProgress } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoopProgress } from '../../hooks/timer/useLoopProgress.js'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { formatTimer } from '../../utils/timer.js'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'
import {
  ProgressTrack,
  RingContainer,
  StatusCircle,
  TimerLabel,
} from './StepStatusTimer.style.js'

function getExpiryTimestamp(step: LiFiStepExtended): Date {
  const { signedAt } = step.execution ?? {}
  if (!signedAt) {
    return new Date()
  }
  return new Date(signedAt + step.estimate.executionDuration * 1000)
}

interface TimerRingProps {
  step: LiFiStepExtended
  size?: number
  showLabel?: boolean
}

export const TimerRing: React.FC<TimerRingProps> = ({
  step,
  size = iconCircleSize,
  showLabel = true,
}) => {
  const { i18n } = useTranslation()
  const [isExpired, setExpired] = useState(false)

  const signedAt = step.execution?.signedAt
  const totalDuration = step.estimate.executionDuration * 1000
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

  const loopProgress = useLoopProgress({
    active: !hasActiveCountdown,
    durationMs: 60_000,
    tickMs: 100,
  })
  const progress = hasActiveCountdown ? countdownProgress : loopProgress

  return (
    <RingContainer sx={{ width: size, height: size }}>
      <ProgressTrack
        variant="determinate"
        value={100}
        size={size}
        thickness={2}
      />
      <MuiCircularProgress
        variant="determinate"
        value={progress}
        size={size}
        thickness={2}
      />
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
