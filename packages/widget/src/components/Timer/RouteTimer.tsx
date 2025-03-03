import type { RouteExtended } from '@lifi/sdk'
import { useStopwatch } from '../../hooks/timer/useStopwatch.js'
import { TimerContent } from './TimerContent.js'

export const RouteTimer: React.FC<{
  route: RouteExtended
}> = ({ route }) => {
  const firstActiveStep = route?.steps.find((step) => step.execution)
  const firstActiveProcess = firstActiveStep?.execution?.process.at(0)

  const startTime = new Date(firstActiveProcess?.startedAt ?? Date.now())
  const { seconds, minutes } = useStopwatch({
    autoStart: true,
    offsetTimestamp: startTime,
  })

  return (
    <TimerContent>
      {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
    </TimerContent>
  )
}
