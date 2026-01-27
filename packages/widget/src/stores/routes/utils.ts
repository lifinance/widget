import type { ExecutionAction, RouteExtended } from '@lifi/sdk'
import microdiff from 'microdiff'

export const isRouteDone = (route: RouteExtended) => {
  return route.steps.every((step) => step.execution?.status === 'DONE')
}

export const isRoutePartiallyDone = (route: RouteExtended) => {
  return route.steps.some((step) =>
    step.execution?.actions.some((action) => action.substatus === 'PARTIAL')
  )
}

export const isRouteRefunded = (route: RouteExtended) => {
  return route.steps.some((step) =>
    step.execution?.actions.some((action) => action.substatus === 'REFUNDED')
  )
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

export const getUpdatedAction = (
  currentRoute: RouteExtended,
  updatedRoute: RouteExtended
): ExecutionAction | undefined => {
  const actionDiff = microdiff(currentRoute, updatedRoute).find((diff) =>
    diff.path.includes('actions')
  )
  if (!actionDiff) {
    return undefined
  }
  // Find action index in the diff array so we can slice the complete action object
  // e.g. ['steps', 0, 'execution', 'actions', 0, 'message']
  const actionDiffIndex = actionDiff.path.indexOf('actions') + 2
  const actionPathSlice = actionDiff.path.slice(0, actionDiffIndex)
  // Reduce updated route using the diff path to get updated process
  const action = actionPathSlice.reduce(
    (obj, path) => obj[path],
    updatedRoute as any
  ) as ExecutionAction
  return action
}

export const getSourceTxHash = (route?: RouteExtended) => {
  const sourceAction = route?.steps[0].execution?.actions
    .filter((action) => action.type !== 'TOKEN_ALLOWANCE')
    .find((action) => action.txHash || action.taskId)
  return sourceAction?.txHash || sourceAction?.taskId
}
