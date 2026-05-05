import type { WidgetConfig } from '../../types/widget.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import type { CheckoutConfig } from '../types/config.js'

/** Lido stETH on Ethereum — default “deposit to” asset for checkout wallet flow. */
const checkoutDefaultDepositToChain = 1
const checkoutDefaultDepositToToken =
  '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'

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
    toChain: merged.toChain ?? checkoutDefaultDepositToChain,
    toToken: merged.toToken ?? checkoutDefaultDepositToToken,
    // Do not default `exchanges.allow` — values must match keys from GET /v1/tools;
    // unknown keys (e.g. intentFactory) fail API validation on `/options/exchanges/allow/*`.
    exchanges: merged.exchanges,
    hiddenUI: mergeUniqueUiFlags(merged.hiddenUI, [
      HiddenUI.ToToken,
      HiddenUI.ReverseTokensButton,
    ]),
    disabledUI: mergeUniqueUiFlags(merged.disabledUI, [DisabledUI.ToToken]),
  }
}
