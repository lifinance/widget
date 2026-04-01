import type { PropsWithChildren, RefObject } from 'react'
import type { FormRef, WidgetConfig } from '../../types/widget.js'
import type { CheckoutError, CheckoutResult } from './results.js'

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

/** Props for `<LifiWidgetCheckout />`. Modal-only props (`open`, `elementRef`) are always top-level. */
export type CheckoutProps = CheckoutModalProps &
  CheckoutConfig & {
    formRef?: FormRef
  }

export interface CheckoutProviderProps extends PropsWithChildren {
  config: CheckoutConfig
}
