import type { RouteExtended } from '@lifi/sdk'

export interface SourceTxIdentifier {
  value: string
  kind: 'txHash' | 'taskId'
}

// Preserve the kind: the SDK status API resolves taskId and txHash differently,
// so a relayed route's taskId must never be polled as a txHash.
export const getSourceTxIdentifier = (
  route?: RouteExtended
): SourceTxIdentifier | undefined => {
  const sourceAction = route?.steps[0]?.execution?.actions
    ?.filter(
      (action) => !['RESET_ALLOWANCE', 'SET_ALLOWANCE'].includes(action.type)
    )
    .find((action) => action.txHash || action.taskId)
  if (!sourceAction) {
    return undefined
  }
  return sourceAction.txHash
    ? { value: sourceAction.txHash, kind: 'txHash' }
    : { value: sourceAction.taskId!, kind: 'taskId' }
}
