import type { WidgetConfig } from '@lifi/widget/shared'
import { DisabledUI, HiddenUI } from '@lifi/widget/shared'
import type { CheckoutConfig } from '../types/config.js'

/** Lido stETH on Ethereum — default “deposit to” asset when the integrator doesn't override it. */
const defaultDepositToChain = 1
const defaultDepositToToken = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'

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
    toChain: merged.toChain ?? defaultDepositToChain,
    toToken: merged.toToken ?? defaultDepositToToken,
    exchanges: merged.exchanges,
    hiddenUI: mergeUniqueUiFlags(merged.hiddenUI, [
      HiddenUI.ToToken,
      HiddenUI.ReverseTokensButton,
    ]),
    disabledUI: mergeUniqueUiFlags(merged.disabledUI, [DisabledUI.ToToken]),
  }
}
