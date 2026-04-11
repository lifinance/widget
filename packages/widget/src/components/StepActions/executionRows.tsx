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
 * A single row in an execution list.
 *
 * Discriminated union covering the two row kinds that can appear in a
 * transaction progress or history view:
 * - `'action'` — a completed or failed step action with a resolvable
 *   explorer link. Rendered by {@link StepActionRow}.
 * - `'wallet'` — the recipient wallet row, appended when a route has a
 *   `toAddress` (typically once completed). Rendered by {@link SentToWalletRow}.
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
 * Derives the list of rows to display for a route.
 *
 * Iterates every step's actions, collapses allowance-type actions via
 * {@link prepareActions}, keeps only `DONE`/`FAILED` actions that have a
 * resolvable transaction link, and appends a `'wallet'` row when
 * `toAddress` is provided.
 *
 * Single source of truth for "which rows should appear" — consumed by
 * static step lists (in-page progress and history) and the animated
 * execution checklist.
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
        const href = action.txHash
          ? getTransactionLink({
              txHash: action.txHash,
              chain: action.chainId,
            })
          : action.txLink
            ? getTransactionLink({
                txLink: action.txLink,
                chain: action.chainId,
              })
            : undefined
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
