import type {
  ExecutionAction,
  LiFiStepExtended,
  RouteExtended,
} from '@lifi/sdk'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useExplorer } from '../../hooks/useExplorer.js'
import { prepareActions } from '../../utils/prepareActions.js'
import { SentToWalletRow } from './SentToWalletRow.js'
import { StepActionRow } from './StepActionRow.js'

/**
 * A row in an execution list: either a completed/failed action with an explorer
 * link, or the recipient wallet row appended when a route has a `toAddress`.
 */
export type ExecutionRow =
  | {
      kind: 'action'
      step: LiFiStepExtended
      action: ExecutionAction
      href: string
    }
  | { kind: 'wallet'; toAddress: string; toChainId: number }

/**
 * The rows to display for a route: every `DONE`/`FAILED` action that has a
 * transaction link, plus a wallet row when `toAddress` is set. Shared by the
 * static step lists and the animated checklist.
 */
export function useExecutionRows(
  route: RouteExtended,
  toAddress?: string
): ExecutionRow[] {
  const { getTransactionLink } = useExplorer()
  return useMemo(() => {
    const rows: ExecutionRow[] = []
    for (const step of route.steps) {
      const groups = prepareActions(step.execution?.actions ?? [])
      for (const group of groups) {
        const action = group.at(-1)
        if (!action) {
          continue
        }
        const isDoneOrFailed =
          action.status === 'DONE' || action.status === 'FAILED'
        if (!isDoneOrFailed) {
          continue
        }
        const href = getTransactionLink({
          txHash: action.txHash,
          txLink: action.txLink,
          chain: action.chainId,
        })
        if (!href) {
          continue
        }
        rows.push({ kind: 'action', step, action, href })
      }
    }
    if (toAddress) {
      rows.push({ kind: 'wallet', toAddress, toChainId: route.toChainId })
    }
    return rows
  }, [route, toAddress, getTransactionLink])
}

/**
 * Renders an {@link ExecutionRow} as the appropriate row component.
 * Callers are responsible for React keys on the returned node.
 */
export function renderExecutionRow(row: ExecutionRow): ReactNode {
  return row.kind === 'action' ? (
    <StepActionRow step={row.step} action={row.action} href={row.href} />
  ) : (
    <SentToWalletRow toAddress={row.toAddress} toChainId={row.toChainId} />
  )
}
