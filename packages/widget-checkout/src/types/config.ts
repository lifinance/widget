import type { FormRef, WidgetConfig } from '@lifi/widget/shared'
import type {
  CheckoutError,
  CheckoutResult,
  OnRampProvider,
} from '@lifi/widget-provider/checkout'
import type { PropsWithChildren, RefObject } from 'react'

export interface CheckoutConfig {
  integrator: string
  onSuccess?: (result: CheckoutResult) => void
  onError?: (error: CheckoutError) => void
  /** `WidgetConfig` overrides. Set the session API URL via `sdkConfig.apiUrl`. */
  config?: Partial<WidgetConfig>
  /** Persist pending checkouts and resume on next mount. @default true */
  resumePending?: boolean
  /**
   * When `true` and `config.toAddress` is omitted, the user sets the
   * destination address inside the widget (paste/ENS or connect wallet)
   * instead of the checkout blocking as misconfigured. @default false
   */
  allowUserDestinationAddress?: boolean
}

export interface CheckoutModalProps {
  elementRef?: RefObject<HTMLDivElement | null>
  open?: boolean
  onClose?(): void
  /** Render inline (non-modal) instead of as a centered modal overlay. */
  inline?: boolean
}

export type CheckoutProps = CheckoutModalProps &
  CheckoutConfig & {
    formRef?: FormRef
    /**
     * On-ramp providers the checkout should offer. Each is created by calling
     * the factory exported by its `@lifi/widget-provider-*` package (e.g.
     * `transakProvider(...)`, `meshProvider()`). Omitting a provider keeps its
     * SDK out of the bundle entirely.
     */
    onRampProviders?: OnRampProvider[]
  }

export interface CheckoutProviderProps extends PropsWithChildren {
  config: CheckoutConfig
}
