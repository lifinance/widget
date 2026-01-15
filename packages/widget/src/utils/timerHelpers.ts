import type { LiFiStepExtended } from '@lifi/sdk'

/**
 * Calculates expiry timestamp based on process start time, estimated duration, and pause time.
 * Pause time is added when action is required (usually for signature requests).
 */
export const getExpiryTimestamp = (step: LiFiStepExtended): Date => {
  const execution = step?.execution
  if (!execution) {
    return new Date()
  }
  let timeInPause = 0
  if (execution?.actionRequiredAt) {
    const actionDoneAt = execution.pendingAt ?? execution.doneAt ?? Date.now()
    timeInPause = new Date(actionDoneAt - execution.actionRequiredAt).getTime()
  }
  const expiry = new Date(
    (execution.startedAt ?? Date.now()) +
      step.estimate.executionDuration * 1000 +
      timeInPause
  )
  return expiry
}

/**
 * Checks if the execution has a main transaction type (SWAP, CROSS_CHAIN, or RECEIVING_CHAIN).
 * Used to determine if the main execution has started (not just token allowance).
 */
export const hasMainExecutionStarted = (step: LiFiStepExtended): boolean => {
  const type = step.execution?.type
  return type === 'SWAP' || type === 'CROSS_CHAIN' || type === 'RECEIVING_CHAIN'
}
