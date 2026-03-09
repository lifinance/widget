import type { LiFiStepExtended } from '@lifi/sdk'
import { CircularProgress as MuiCircularProgress } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { formatTimer } from '../../utils/timer.js'
import {
  circleSize,
  ProgressTrack,
  RingContainer,
  StatusCircle,
  TimerLabel,
} from './CircularProgress.style.js'

const getExpiryTimestamp = (step: LiFiStepExtended) => {
  const execution = step?.execution
  if (!execution) {
    return new Date()
  }
  return new Date(
    (execution.signedAt ?? Date.now()) + step.estimate.executionDuration * 1000
  )
}

export const IndeterminateRing: React.FC = () => (
  <RingContainer>
    <ProgressTrack
      variant="determinate"
      value={100}
      size={circleSize}
      thickness={3}
    />
    <MuiCircularProgress
      variant="indeterminate"
      size={circleSize}
      thickness={3}
      sx={{ position: 'absolute' }}
    />
  </RingContainer>
)

export const TimerRing: React.FC<{ step: LiFiStepExtended }> = ({ step }) => {
  const { i18n } = useTranslation()
  const [isExpired, setExpired] = useState(false)

  const totalDuration = step.estimate.executionDuration * 1000
  const expiryTimestamp = getExpiryTimestamp(step)

  const { days, hours, minutes, seconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })

  const isTimerExpired = isExpired || (!minutes && !seconds)
  const remaining = Math.max(expiryTimestamp.getTime() - Date.now(), 0)
  const progress =
    totalDuration > 0
      ? Math.min(((totalDuration - remaining) / totalDuration) * 100, 100)
      : 0

  if (isTimerExpired) {
    return <IndeterminateRing />
  }

  return (
    <RingContainer>
      <ProgressTrack
        variant="determinate"
        value={100}
        size={circleSize}
        thickness={3}
      />
      <MuiCircularProgress
        variant="determinate"
        value={progress}
        size={circleSize}
        thickness={3}
        sx={{ position: 'absolute' }}
      />
      <StatusCircle sx={{ position: 'absolute' }}>
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
    </RingContainer>
  )
}
