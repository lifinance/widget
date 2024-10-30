import type { LiFiStepExtended } from '@lifi/sdk'
import { AccessTimeFilled } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import { type FC, type PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTimer } from '../../hooks/timer/useTimer.js'
import { IconTypography } from '../IconTypography.js'

const getExecutionProcess = (step: LiFiStepExtended) =>
  step.execution?.process.findLast(
    (process) =>
      process.type === 'SWAP' ||
      process.type === 'CROSS_CHAIN' ||
      process.type === 'RECEIVING_CHAIN'
  )

const getExpiryTimestamp = (step: LiFiStepExtended) =>
  new Date(
    (getExecutionProcess(step)?.startedAt ?? Date.now()) +
      step.estimate.executionDuration * 1000
  )

export const StepTimer: React.FC<{
  step: LiFiStepExtended
  hideInProgress?: boolean
}> = ({ step, hideInProgress }) => {
  const { t, i18n } = useTranslation()
  const [isExpired, setExpired] = useState(false)
  const [isExecutionStarted, setExecutionStarted] = useState(
    () => !!getExecutionProcess(step)
  )
  const [expiryTimestamp, setExpiryTimestamp] = useState(() =>
    getExpiryTimestamp(step)
  )
  const { seconds, minutes, isRunning, pause, resume, restart } = useTimer({
    autoStart: false,
    expiryTimestamp,
    onExpire: () => setExpired(true),
  })

  useEffect(() => {
    const executionProcess = getExecutionProcess(step)
    if (!executionProcess) {
      return
    }
    const shouldRestart = executionProcess.status === 'FAILED'
    const shouldPause = executionProcess.status === 'ACTION_REQUIRED'
    const shouldStart =
      executionProcess.status === 'STARTED' ||
      executionProcess.status === 'PENDING'
    const shouldResume = executionProcess.status === 'PENDING'
    if (isExecutionStarted && shouldRestart) {
      setExecutionStarted(false)
      setExpired(false)
      return
    }
    if (isExecutionStarted && isExpired) {
      return
    }
    if (!isExecutionStarted && shouldStart) {
      const expiryTimestamp = getExpiryTimestamp(step)
      setExecutionStarted(true)
      setExpired(false)
      setExpiryTimestamp(expiryTimestamp)
      restart(expiryTimestamp)
      return
    }
    if (isRunning && shouldPause) {
      pause()
    } else if (!isRunning && shouldResume) {
      resume()
    }
  }, [isExecutionStarted, isExpired, isRunning, pause, restart, resume, step])

  if (!isExecutionStarted) {
    const showSeconds = step.estimate.executionDuration < 60
    const duration = showSeconds
      ? Math.floor(step.estimate.executionDuration)
      : Math.floor(step.estimate.executionDuration / 60)
    return (
      <StepTimerContent>
        {duration.toLocaleString(i18n.language, {
          style: 'unit',
          unit: showSeconds ? 'second' : 'minute',
          unitDisplay: 'narrow',
        })}
      </StepTimerContent>
    )
  }

  const isTimerExpired = isExpired || (!minutes && !seconds)

  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED' ||
    (isTimerExpired && hideInProgress)
  ) {
    return null
  }

  return isTimerExpired ? (
    t('main.inProgress')
  ) : (
    <StepTimerContent>
      {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </StepTimerContent>
  )
}

const StepTimerContent: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('tooltip.estimatedTime')} sx={{ cursor: 'help' }}>
      <Box component="span" display="flex" alignItems="center" height={14}>
        <IconTypography
          component="span"
          sx={{ marginRight: 0.5, fontSize: 16 }}
        >
          <AccessTimeFilled fontSize="inherit" />
        </IconTypography>
        <Box
          component="span"
          sx={{
            fontVariantNumeric: 'tabular-nums',
            cursor: 'help',
          }}
        >
          {children}
        </Box>
      </Box>
    </Tooltip>
  )
}
