import type { LiFiStepExtended } from '@lifi/sdk'
import type React from 'react'
import { useExecutionTimer } from '../../hooks/useExecutionTimer'
import { formatTimerText } from '../../utils/formatTimerText.js'
import {
  ActionRequiredContainer,
  ActionRequiredIcon,
  BackgroundProgress,
  ProgressRing,
  TIMER_SIZE,
  TimerContainer,
  TimerText,
} from './ExecutionTimer.style'

interface ExecutionTimerProps {
  step: LiFiStepExtended
}

export const ExecutionTimer: React.FC<ExecutionTimerProps> = ({ step }) => {
  const timerData = useExecutionTimer(step)

  if (!timerData) {
    return null
  }

  const { days, hours, minutes, seconds, progress, actionRequired } = timerData

  return (
    <TimerContainer>
      <BackgroundProgress
        variant="determinate"
        value={100}
        size={TIMER_SIZE}
        thickness={2}
      />
      <ProgressRing
        variant="determinate"
        value={progress}
        size={TIMER_SIZE}
        thickness={2}
      />
      {actionRequired ? (
        <ActionRequiredContainer>
          <ActionRequiredIcon />
        </ActionRequiredContainer>
      ) : (
        <TimerText>
          {formatTimerText({ days, hours, minutes, seconds })}
        </TimerText>
      )}
    </TimerContainer>
  )
}
