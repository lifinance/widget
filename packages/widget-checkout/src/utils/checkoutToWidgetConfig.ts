import type { WidgetConfig } from '@lifi/widget/shared'
import type { CheckoutConfig } from '../types/config.js'

export function checkoutConfigToWidgetConfig(
  checkout: CheckoutConfig
): WidgetConfig {
  const merged: WidgetConfig = {
    integrator: checkout.integrator,
    ...checkout.config,
    mode: 'custom',
    modeOptions: { custom: { type: 'deposit' } },
    variant: 'compact',
  }

  // toChain/toToken/toAddress are required config; CheckoutConfigGuard blocks when missing.
  return {
    ...merged,
    hiddenUI: {
      ...merged.hiddenUI,
      toToken: true,
      reverseTokensButton: true,
    },
    disabledUI: {
      ...merged.disabledUI,
      toToken: true,
    },
  }
}
