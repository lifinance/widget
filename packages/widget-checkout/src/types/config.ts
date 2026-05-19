import type { FormRef, WidgetConfig } from '@lifi/widget/shared'
import type {
  CheckoutError,
  CheckoutResult,
  OnRampProvider,
} from '@lifi/widget-provider/checkout'
import type { PropsWithChildren, RefObject } from 'react'

export interface CheckoutConfig {
  integrator: string
  onrampSessionApiUrl?: string
  onSuccess?: (result: CheckoutResult) => void
  onError?: (error: CheckoutError) => void
  /** `WidgetConfig` overrides — pass `apiKey`, `providers`, `theme`, `toChain`, `toToken`, etc. here. */
  config?: Partial<WidgetConfig>
}

export interface CheckoutModalProps {
  elementRef?: RefObject<HTMLDivElement | null>
  open?: boolean
  onClose?(): void
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
