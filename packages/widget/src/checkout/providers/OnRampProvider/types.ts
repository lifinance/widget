import type { FC, ReactNode } from 'react'
import type { WidgetConfig } from '../../../types/widget.js'

export interface OnRampProviderMeta {
  id: string
  name: string
  description: string
  features: string[]
  recommended?: boolean
}

export interface LoadedOnRampAdapter {
  meta: OnRampProviderMeta
  Wrap: FC<{
    widgetConfig: WidgetConfig
    children: ReactNode
  }>
}

export type OnRampFailureKind = 'connection' | 'withdrawal'

export interface OnRampFailureState {
  kind: OnRampFailureKind
  /** Localized message for the secondary line under the title. */
  message: string
  /** Stable code for telemetry / support tickets. */
  reportCode?: string
  /** Re-runs the flow from scratch (new session, new linkToken). */
  retry: () => void
}

export interface OnRampFlowOpenArgs {
  depositAddress: string
  amount: string
  fiatCurrency?: 'USD' | 'EUR' | 'GBP'
}

export interface OnRampFlowValue {
  openDepositFlow: (args: OnRampFlowOpenArgs) => void
  close: () => void
  isOpen: boolean
  isLoading: boolean
  /**
   * Inline error string for pre-flight failures shown next to the funding
   * card (e.g. session API errors before Mesh ever opens). Terminal
   * post-open failures are surfaced via `failure` and rendered full-screen.
   */
  error: string | null
  /** Terminal post-open failure (Connection / Withdrawal). Drives full-screen UI. */
  failure: OnRampFailureState | null
  /**
   * On-chain hash of the most recently completed deposit. Only set when
   * the provider reports a real on-chain hash — never an internal txId
   * that wouldn't resolve via LI.FI's status endpoint.
   */
  depositTxHash: string | null
  /** Clears `depositTxHash` after the consumer has handed it off. */
  acknowledgeDepositTxHash: () => void
}
