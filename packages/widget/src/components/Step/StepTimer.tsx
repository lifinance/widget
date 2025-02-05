import type { LiFiStepExtended } from '@lifi/sdk'
import { AccessTimeFilled } from '@mui/icons-material'
import { Box, Tooltip } from '@mui/material'
import { type FC, type PropsWithChildren, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStopwatch } from '../../hooks/timer/useStopwatch.js'
import { IconTypography } from '../IconTypography.js'

const getExecutionProcess = (step: LiFiStepExtended) =>
  step.execution?.process.findLast(
    (process) =>
      process.type === 'SWAP' ||
      process.type === 'CROSS_CHAIN' ||
      process.type === 'RECEIVING_CHAIN'
  )

const getStartTimestamp = (step: LiFiStepExtended) =>
  new Date(getExecutionProcess(step)?.startedAt ?? Date.now())

export const StepTimer: React.FC<{
  step: LiFiStepExtended
  hideInProgress?: boolean
}> = ({ step }) => {
  const { i18n } = useTranslation()

  const [isExecutionStarted, setExecutionStarted] = useState(
    () => !!getExecutionProcess(step)
  )

  const { seconds, minutes, isRunning, pause, reset, start } = useStopwatch({
    autoStart: false,
    offsetTimestamp: getStartTimestamp(step),
  })

  useEffect(() => {
    const executionProcess = getExecutionProcess(step)
    if (!executionProcess) {
      return
    }

    const shouldRestart =
      executionProcess.status === 'FAILED' || executionProcess.status === 'DONE'
    const shouldPause = executionProcess.status === 'ACTION_REQUIRED'
    const shouldStart =
      executionProcess.status === 'STARTED' ||
      executionProcess.status === 'PENDING'
    const shouldResume = executionProcess.status === 'PENDING'
    if (isExecutionStarted && shouldRestart) {
      setExecutionStarted(false)
      pause()
      return
    }
    if (isExecutionStarted && shouldPause && isRunning) {
      pause()
      return
    }
    if (isExecutionStarted && !isRunning && shouldResume) {
      start()
      return
    }
    if (!isExecutionStarted && shouldStart) {
      setExecutionStarted(true)
      reset()
      return
    }
  }, [isExecutionStarted, isRunning, pause, reset, start, step])

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

  if (
    step.execution?.status === 'DONE' ||
    step.execution?.status === 'FAILED'
  ) {
    return null
  }

  return (
    <StepTimerContent>
      {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </StepTimerContent>
  )
}

const StepTimerContent: FC<PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('tooltip.estimatedTime')} sx={{ cursor: 'help' }}>
      <Box
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 14,
        }}
      >
        <IconTypography as="span" sx={{ marginRight: 0.5, fontSize: 16 }}>
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
