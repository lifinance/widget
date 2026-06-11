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
  /** Widget color mode; providers that support theming mirror it (e.g. Mesh's `theme`). */
  appearance?: 'light' | 'dark' | 'system'
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
  /**
   * Origins worth warming with `<link rel="preconnect">` before the provider
   * opens (e.g. the SDK's iframe host) — opening is network-bound on them.
   */
  preconnectOrigins?: string[]
  Host: FC<{ widgetConfig: OnRampHostWidgetConfig }>
}

export type OnRampProviderFactory<TOptions = void> = TOptions extends void
  ? () => OnRampProvider
  : (options: TOptions) => OnRampProvider

/**
 * Session a Host registers via `useRegisterOnRampSession`. The Host MUST pass a
 * referentially-stable (memoized) object: the registry short-circuits on
 * reference equality, so a new object every render thrashes register/unregister
 * and churns subscribed consumers. Memoize it with `useMemo` keyed on its
 * fields.
 */
export interface OnRampSession {
  open: (args: OnRampOpenArgs) => void
  close: () => void
  /**
   * User-initiated abort: surfaces a `cancelled` failure (with retry) instead
   * of clearing state like `close()`, so the checkout returns to amount entry.
   */
  cancel: () => void
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

/**
 * A previously-linked exchange account passed back into a provider's flow to
 * skip re-authentication (Mesh's `IntegrationAccessToken`). Shape mirrored here
 * so provider packages need not import a specific SDK's types.
 */
export interface OnRampAccessToken {
  accountId: string
  accountName: string
  accessToken: string
  brokerType: string
  brokerName: string
}

export interface OnRampOpenArgs {
  depositAddress: string
  amount: string
  fiatCurrency?: 'USD' | 'EUR' | 'GBP'
  /**
   * Previously-connected exchange accounts to resume. When set, the provider
   * (Mesh) re-enters its flow at the asset/transfer step instead of the catalog
   * + login. Providers that don't support reconnection ignore this.
   */
  accessTokens?: OnRampAccessToken[]
  /** Active UI language (e.g. i18n `en`); providers that localize honor it. */
  language?: string
  /**
   * Prefilled fiat amount for the provider's widget (e.g. Transak's
   * `fiatAmount`). Derived from the checkout's EnterAmount value times the
   * source token's USD price; optional because not every provider honors it.
   */
  fiatAmount?: string
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
  /** Resolved from `sdkConfig.apiUrl` by `CheckoutSdkBridge`. */
  apiUrl?: string
  onSuccess?: (result: CheckoutResult) => void
  onError?: (error: CheckoutError) => void
  /** @default true */
  resumePending?: boolean
  /**
   * When `true` and no `toAddress` is configured, the user is prompted to set
   * the destination address in the widget instead of the checkout blocking as
   * misconfigured. @default false
   */
  allowUserDestinationAddress?: boolean
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
