import type { LiFiStepExtended } from '@lifi/sdk'
import { CircularProgress as MuiCircularProgress } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { formatTimer } from '../../utils/timer.js'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'
import {
  IndeterminateRing,
  ProgressTrack,
  RingContainer,
  StatusCircle,
  TimerLabel,
} from './StepStatusTimer.style.js'

export { IndeterminateRing }

const getExpiryTimestamp = (step: LiFiStepExtended) => {
  const execution = step?.execution
  if (!execution) {
    return new Date()
  }
  return new Date(
    (execution.signedAt ?? Date.now()) + step.estimate.executionDuration * 1000
  )
}

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
        size={iconCircleSize}
        thickness={2}
      />
      <MuiCircularProgress
        variant="determinate"
        value={progress}
        size={iconCircleSize}
        thickness={2}
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
