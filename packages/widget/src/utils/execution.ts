import type { LiFiStepExtended } from '@lifi/sdk'

export const getExecutionStatus = (step: LiFiStepExtended) => {
  const executionStatus = step?.execution?.status
  const action = step?.execution?.actions.find(
    (action) => action.type === step?.execution?.type
  )
  if (action?.isDone) {
    return 'DONE'
  }
  return executionStatus
}
