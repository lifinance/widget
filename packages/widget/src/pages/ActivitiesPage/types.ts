import type { RouteExecution } from '../../stores/routes/types.js'

export type ActiveItem = { type: 'active'; routeId: string; startedAt: number }
export type LocalItem = {
  type: 'local'
  routeExecution: RouteExecution
  txHash: string
  startedAt: number
}
export type HistoryItem = {
  type: 'history'
  routeExecution: RouteExecution
  txHash: string
  startedAt: number
}
export type TransactionListItem = ActiveItem | LocalItem | HistoryItem
