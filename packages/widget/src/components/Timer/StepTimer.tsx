import type { LiFiStepExtended } from '@lifi/sdk'
import { Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { formatTimer, getExpiryTimestamp } from '../../utils/timer.js'

export const StepTimer: React.FC<{
  step: LiFiStepExtended
}> = ({ step }) => {
  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED' ||
    !step.execution?.signedAt
  ) {
    return null
  }

  return <ExecutionTimer expiryTimestamp={getExpiryTimestamp(step)} />
}

const ExecutionTimer = ({ expiryTimestamp }: { expiryTimestamp: Date }) => {
  const { i18n } = useTranslation()

  const [isExpired, setExpired] = useState(false)

  const { days, hours, minutes, seconds } = useTimer({
    autoStart: true,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })

  const isTimerExpired = isExpired || (!minutes && !seconds)

  if (isTimerExpired) {
    return null
  }

  return (
    <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
      {formatTimer({
        locale: i18n.language,
        days,
        hours,
        minutes,
        seconds,
      })}
    </Typography>
  )
}
