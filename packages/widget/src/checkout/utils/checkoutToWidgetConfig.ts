import type { WidgetConfig } from '../../types/widget.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import type { CheckoutConfig } from '../types/config.js'

function mergeUniqueUiFlags<T extends string>(
  existing: T[] | undefined,
  required: T[]
): T[] {
  return [...new Set<T>([...(existing ?? []), ...required])]
}

/** Checkout always uses a non-drawer widget layout: compact + deposit custom subvariant. */
export function checkoutConfigToWidgetConfig(
  checkout: CheckoutConfig
): WidgetConfig {
  const merged: WidgetConfig = {
    integrator: checkout.integrator,
    ...checkout.config,
    subvariant: 'custom',
    subvariantOptions: { custom: 'deposit' },
    variant: 'compact',
  }

  return {
    ...merged,
    hiddenUI: mergeUniqueUiFlags(merged.hiddenUI, [
      HiddenUI.ToToken,
      HiddenUI.ReverseTokensButton,
    ]),
    disabledUI: mergeUniqueUiFlags(merged.disabledUI, [DisabledUI.ToToken]),
  }
}
