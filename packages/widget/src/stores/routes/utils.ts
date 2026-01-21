import type { Execution, RouteExtended } from '@lifi/sdk'
import microdiff from 'microdiff'

export const isRouteDone = (route: RouteExtended) => {
  return route.steps.every((step) => step.execution?.status === 'DONE')
}

export const isRoutePartiallyDone = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.substatus === 'PARTIAL')
}

export const isRouteRefunded = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.substatus === 'REFUNDED')
}

export const isRouteFailed = (route: RouteExtended) => {
  return route.steps.some((step) => step.execution?.status === 'FAILED')
}

export const isRouteActive = (route?: RouteExtended) => {
  if (!route) {
    return false
  }
  const isDone = isRouteDone(route)
  const isFailed = isRouteFailed(route)
  const alreadyStarted = route.steps.some((step) => step.execution)
  return !isDone && !isFailed && alreadyStarted
}

export const getUpdatedExecution = (
  currentRoute: RouteExtended,
  updatedRoute: RouteExtended
): Execution | undefined => {
  const executionDiff = microdiff(currentRoute, updatedRoute).find((diff) =>
    diff.path.includes('execution')
  )
  if (!executionDiff) {
    return undefined
  }
  // Find execution index in the diff array so we can slice the complete execution object
  // e.g. ['steps', 0, 'execution', 'transactions', 0, 'status']
  const executionDiffIndex = executionDiff.path.indexOf('execution') + 1
  const executionPathSlice = executionDiff.path.slice(0, executionDiffIndex)
  // Reduce updated route using the diff path to get updated execution
  const execution = executionPathSlice.reduce(
    (obj, path) => obj[path],
    updatedRoute as any
  ) as Execution
  return execution
}

export const getSourceTxHash = (route?: RouteExtended) => {
  const sourceTransaction = route?.steps[0].execution?.transactions
    .filter((transaction) => transaction.type !== 'TOKEN_ALLOWANCE')
    .find((transaction) => transaction.txHash || transaction.taskId)
  return sourceTransaction?.txHash || sourceTransaction?.taskId
}
