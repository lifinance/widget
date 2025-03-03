import type { LiFiStepExtended } from '@lifi/sdk'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStopwatch } from '../../hooks/timer/useStopwatch.js'
import { TimerContent } from './TimerContent.js'

const getFirstExecutionProcess = (step: LiFiStepExtended) =>
  step.execution?.process.at(0)

const getExecutionProcess = (step: LiFiStepExtended) =>
  step.execution?.process.at(-1)

const getStartTimestamp = (step: LiFiStepExtended) =>
  new Date(getFirstExecutionProcess(step)?.startedAt ?? Date.now())

export const StepTimer: React.FC<{
  step: LiFiStepExtended
  hideInProgress?: boolean
}> = ({ step }) => {
  const { i18n } = useTranslation()

  const [isExecutionStarted, setExecutionStarted] = useState(
    () => !!getExecutionProcess(step)
  )

  const { seconds, minutes, isRunning, pause, reset, start } = useStopwatch({
    autoStart: true,
    offsetTimestamp: getStartTimestamp(step),
  })

  useEffect(() => {
    const executionProcess = getExecutionProcess(step)
    if (!executionProcess) {
      return
    }

    const shouldRestart =
      executionProcess.status === 'FAILED' || executionProcess.status === 'DONE'
    const shouldStart =
      executionProcess.status === 'STARTED' ||
      executionProcess.status === 'PENDING'
    const shouldResume = executionProcess.status === 'PENDING'
    if (isExecutionStarted && shouldRestart) {
      setExecutionStarted(false)
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

  if (step.execution?.status === 'DONE') {
    return null
  }

  if (!isExecutionStarted) {
    const showSeconds = step.estimate.executionDuration < 60
    const duration = showSeconds
      ? Math.floor(step.estimate.executionDuration)
      : Math.floor(step.estimate.executionDuration / 60)
    return (
      <TimerContent>
        {duration.toLocaleString(i18n.language, {
          style: 'unit',
          unit: showSeconds ? 'second' : 'minute',
          unitDisplay: 'narrow',
        })}
      </TimerContent>
    )
  }

  return (
    <TimerContent>
      {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </TimerContent>
  )
}
