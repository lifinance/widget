import type { FC } from 'react'

/**
 * Structural subset of the widget's `WidgetConfig` that an on-ramp Host
 * reads. The widget passes its full `WidgetConfig` at runtime; structural
 * typing keeps provider packages from importing `@lifi/widget`'s type
 * surface. Field names are intentionally identical to `WidgetConfig` so
 * assignment works without conversion.
 */
export interface OnRampHostWidgetConfig {
  apiKey?: string
  toChain?: number
  toToken?: string
}

/**
 * Funding category the widget routes by. The checkout's funding-source
 * UI offers each category to the user; the registered provider for that
 * category receives the `open()` call.
 */
export type OnRampFundingCategory = 'cash' | 'exchange'

/**
 * Adapter contract each `@lifi/widget-provider-*` on-ramp package implements.
 * The factory returns identity metadata plus a `Host` component that mounts
 * the provider's SDK and registers its session via `useRegisterOnRampSession`.
 *
 * Partners pass the array of adapters via `LifiWidgetCheckout`'s
 * `onRampProviders` prop. Not installing a provider package keeps its SDK
 * out of the bundle entirely.
 */
export interface OnRampProvider {
  id: string
  fundingCategory: OnRampFundingCategory
  name: string
  description: string
  features: string[]
  recommended?: boolean
  Host: FC<{ widgetConfig: OnRampHostWidgetConfig }>
}

export type OnRampProviderFactory<TOptions = void> = TOptions extends void
  ? () => OnRampProvider
  : (options: TOptions) => OnRampProvider

export interface OnRampSession {
  open: (args: OnRampOpenArgs) => void
  close: () => void
  isOpen: boolean
  isLoading: boolean
  /**
   * Structured pre-flight error (e.g. session API failures shown next to the
   * funding card). Hosts emit stable codes / free-text messages; the widget
   * formats them with its own i18n. Terminal post-open failures live on
   * `failure` instead.
   */
  error: OnRampError | null
  failure: OnRampFailure | null
  /**
   * On-chain deposit hash, set only when the provider reports a real hash
   * (not an internal txId). Consumed by the checkout to drive status polling.
   */
  depositTxHash: string | null
  /**
   * Clears `depositTxHash` after the consumer consumes it. Providers that
   * never emit a hash (e.g. Transak) may implement this as a no-op.
   */
  acknowledgeDepositTxHash: () => void
  /**
   * DOM element id the provider's SDK targets. The widget renders a
   * `<div id={mountTargetId}>` inside its hosted modal when this is set.
   * Providers that manage their own overlay (e.g. Mesh) set this to `null`.
   *
   * NOTE: typically a `React.useId()` value, which contains `:` characters.
   * Safe with `document.getElementById` (what every SDK we ship uses), but
   * NOT a valid CSS selector — do not pass it to `document.querySelector`.
   */
  mountTargetId: string | null
}

/**
 * Stable, provider-agnostic error codes the widget knows how to translate
 * under `checkout.onramp.errors.<code>`. Hosts emit one of these (with
 * `{{providerName}}` and other interpolation params populated by the
 * widget); free-text server messages travel on `OnRampError.message`
 * instead.
 */
export type OnRampErrorCode =
  | 'MISSING_API_URL'
  | 'MISSING_API_KEY'
  | 'TARGET_NOT_CONFIGURED'
  | 'INVALID_RESPONSE'
  | 'NETWORK_ERROR'
  | 'SESSION_HTTP'

export interface OnRampError {
  /** Stable translation code; the widget renders the matching string. */
  code?: OnRampErrorCode
  /**
   * Free-text fallback (e.g. server error from API response). Takes
   * precedence over `code` when present.
   */
  message?: string
  /**
   * Extra interpolation params for the `code` translation (e.g. `status`).
   * Reserved: `providerName` is supplied by the widget and overrides any
   * value here.
   */
  params?: Record<string, unknown>
}

export interface OnRampOpenArgs {
  depositAddress: string
  amount: string
  fiatCurrency?: 'USD' | 'EUR' | 'GBP'
  /**
   * The deposit asset the on-ramp must withdraw to `depositAddress`. This is
   * the route's source token/chain (not the widget's destination): the LI.FI
   * deposit address handles any final swap to the destination asset.
   */
  fromChainId: number
  fromTokenAddress: string
}

export type OnRampFailureKind =
  | 'connection'
  | 'withdrawal'
  | 'cancelled'
  | 'unavailable'

export interface OnRampFailure {
  kind: OnRampFailureKind
  /**
   * Optional free-text override; the widget falls back to its own default
   * description for the failure kind when this is undefined.
   */
  message?: string
  reportCode?: string
  retry: () => void
}

/**
 * Runtime checkout config the on-ramp hosts need. The widget's
 * `CheckoutProvider` pushes these fields into `CheckoutContext`; provider
 * packages read them via `useCheckoutConfig`.
 */
export interface CheckoutContextValue {
  integrator: string
  /** Core API base URL for checkout sessions, e.g. `https://develop.li.quest`. */
  onrampSessionApiUrl?: string
  onSuccess?: (result: CheckoutResult) => void
  onError?: (error: CheckoutError) => void
}

export interface CheckoutResult {
  provider: string
  transactionHash?: string
  amount: string
  token: string
  chainId: number
}

export interface CheckoutError {
  code: string
  message: string
  provider?: string
}
