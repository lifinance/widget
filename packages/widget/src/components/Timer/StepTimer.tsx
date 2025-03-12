import type { LiFiStepExtended } from '@lifi/sdk'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useStopwatch } from '../../hooks/timer/useStopwatch.js'
import { useSettings } from '../../stores/settings/useSettings.js'
import { formatTimer } from '../../utils/timer.js'
import { TimerContent } from './TimerContent.js'

const getExecutionProcess = (step: LiFiStepExtended) =>
  step.execution?.process.at(-1)

const getStartTimestamp = (step: LiFiStepExtended) => {
  return new Date(step.execution?.startedAt || Date.now())
}

export const StepTimer: React.FC<{
  step: LiFiStepExtended
  hideInProgress?: boolean
}> = ({ step }) => {
  const { i18n } = useTranslation()
  const { language } = useSettings(['language'])

  const isExecutionStarted = !!getExecutionProcess(step)

  const { seconds, minutes, days, hours, reset, start, isRunning } =
    useStopwatch({
      offsetTimestamp: getStartTimestamp(step),
    })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const status = step.execution?.status
    if (isExecutionStarted && status) {
      if (status === 'FAILED') {
        return reset(new Date(), false)
      }
      if (isRunning) {
        if (status === 'DONE') {
          return reset(getStartTimestamp(step), false)
        }
      } else {
        if (status === 'PENDING') {
          return start()
        }
      }
    }
  }, [isExecutionStarted, isRunning, step])

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
      {formatTimer({
        locale: language,
        days,
        hours,
        minutes,
        seconds,
      })}
    </TimerContent>
  )
}
