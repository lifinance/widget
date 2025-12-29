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

type Transaction = Execution['transactions'][number]

export const getUpdatedTransaction = (
  currentRoute: RouteExtended,
  updatedRoute: RouteExtended
): Transaction | undefined => {
  const transactionDiff = microdiff(currentRoute, updatedRoute).find((diff) =>
    diff.path.includes('transactions')
  )
  if (!transactionDiff) {
    return undefined
  }
  // Find transaction index in the diff array so we can slice the complete transaction object
  // e.g. ['steps', 0, 'execution', 'transactions', 0, 'status']
  const transactionDiffIndex = transactionDiff.path.indexOf('transactions') + 2
  const transactionPathSlice = transactionDiff.path.slice(
    0,
    transactionDiffIndex
  )
  // Reduce updated route using the diff path to get updated transaction
  const transaction = transactionPathSlice.reduce(
    (obj, path) => obj[path],
    updatedRoute as any
  ) as Transaction
  return transaction
}

export const getSourceTxHash = (route?: RouteExtended) => {
  const sourceTransaction = route?.steps[0].execution?.transactions
    .filter((transaction) => transaction.type !== 'TOKEN_ALLOWANCE')
    .find((transaction) => transaction.txHash || transaction.taskId)
  return sourceTransaction?.txHash || sourceTransaction?.taskId
}
