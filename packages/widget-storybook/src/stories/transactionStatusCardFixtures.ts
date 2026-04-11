import { RouteExecutionStatus } from '@lifi/widget/src/stores/routes/types'
import { type MockRouteKey, mockRoutes } from './mocks/mockRoute'

export { type MockRouteKey, mockRoutes }

const { Pending, Done, Failed, Partial, Refunded } = RouteExecutionStatus

// ── Execution sequence ──────────────────────────────────────────────────────
// Each entry is a { routeKey, status } pair. The story component reads the
// mock route and derives everything from it — matching production exactly.

export interface ExecutionStep {
  routeKey: MockRouteKey
  status: RouteExecutionStatus
}

/** Linear pending flow — 5 steps progressing through execution. */
export const pendingSteps: ExecutionStep[] = [
  { routeKey: 'pendingAllowance', status: Pending },
  { routeKey: 'pendingSwapSign', status: Pending },
  { routeKey: 'pendingSwap', status: Pending },
  { routeKey: 'pendingBridge', status: Pending },
  { routeKey: 'pendingReceiving', status: Pending },
]

/** Terminal states — user picks which outcome. */
export type TerminalKey = 'done' | 'donePartial' | 'doneRefunded' | 'failed'

export const terminalSteps: Record<TerminalKey, ExecutionStep> = {
  done: { routeKey: 'done', status: Done },
  donePartial: { routeKey: 'donePartial', status: Done | Partial },
  doneRefunded: { routeKey: 'doneRefunded', status: Done | Refunded },
  failed: { routeKey: 'failed', status: Failed },
}

export const terminalKeys: TerminalKey[] = [
  'done',
  'donePartial',
  'doneRefunded',
  'failed',
]

export const terminalLabels: Record<TerminalKey, string> = {
  done: 'Success',
  donePartial: 'Partial',
  doneRefunded: 'Refunded',
  failed: 'Failed',
}

/** All states for the Interactive story. */
export const allStepEntries = [
  {
    label: 'Pending (allowance)',
    key: 'pendingAllowance' as MockRouteKey,
    status: Pending,
  },
  {
    label: 'Pending (sign swap)',
    key: 'pendingSwapSign' as MockRouteKey,
    status: Pending,
  },
  {
    label: 'Pending (swap)',
    key: 'pendingSwap' as MockRouteKey,
    status: Pending,
  },
  {
    label: 'Pending (bridge)',
    key: 'pendingBridge' as MockRouteKey,
    status: Pending,
  },
  {
    label: 'Pending (receiving)',
    key: 'pendingReceiving' as MockRouteKey,
    status: Pending,
  },
  { label: 'Done', key: 'done' as MockRouteKey, status: Done },
  {
    label: 'Done (partial)',
    key: 'donePartial' as MockRouteKey,
    status: (Done | Partial) as RouteExecutionStatus,
  },
  {
    label: 'Done (refunded)',
    key: 'doneRefunded' as MockRouteKey,
    status: (Done | Refunded) as RouteExecutionStatus,
  },
  { label: 'Failed', key: 'failed' as MockRouteKey, status: Failed },
] as const
