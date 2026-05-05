import { useExecutionTimer } from '../../hooks/timer/useExecutionTimer.js'

export const ExecutionTimerText = ({
  expiryTimestamp,
}: {
  expiryTimestamp: Date
}): string | null => {
  const { formatted } = useExecutionTimer(expiryTimestamp)
  return formatted
}
