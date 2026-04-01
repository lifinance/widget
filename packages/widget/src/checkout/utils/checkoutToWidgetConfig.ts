import type { WidgetConfig } from '../../types/widget.js'
import { DisabledUI, HiddenUI } from '../../types/widget.js'
import { deepMerge } from '../../utils/deepMerge.js'
import type { CheckoutConfig } from '../types/config.js'
import { checkoutThemeToWidgetTheme } from './checkoutThemeToWidgetTheme.js'
import { getDefaultCheckoutWalletProviders } from './defaultCheckoutWalletProviders.js'

function mergeLanguageResources(
  a: WidgetConfig['languageResources'],
  b: WidgetConfig['languageResources']
): WidgetConfig['languageResources'] {
  if (!a && !b) {
    return undefined
  }
  return deepMerge(
    (a ?? {}) as Record<string, unknown>,
    (b ?? {}) as Record<string, unknown>
  ) as WidgetConfig['languageResources']
}

function mergeUniqueUiFlags<T extends string>(
  existing: T[] | undefined,
  required: T[]
): T[] {
  const set = new Set<T>()
  if (existing) {
    for (const x of existing) {
      set.add(x)
    }
  }
  for (const x of required) {
    set.add(x)
  }
  return [...set]
}

/**
 * Checkout always uses a non-drawer widget layout: compact + deposit custom subvariant.
 *
 * When no `providers` are passed (common for minimal `<LifiWidgetCheckout />` usage),
 * we inject the standard Li.Fi wallet stack so `WalletProvider` can detect wallets.
 * The full widget/playground usually sets `providers` explicitly; checkout did not
 * default them before, which led to an empty wallet list.
 */
export function checkoutConfigToWidgetConfig(
  checkout: CheckoutConfig,
  widgetOverrides?: Partial<WidgetConfig>
): WidgetConfig {
  const widgetFromCheckout = checkout.widget
  const merged: WidgetConfig = {
    integrator: checkout.integrator,
    apiKey: checkout.apiKey,
    appearance: checkout.appearance,
    theme: checkoutThemeToWidgetTheme(checkout.theme),
    // Do not default to [] here — [] means “no providers”; omitted means “use checkout defaults”
    providers: checkout.providers,
    sdkConfig: checkout.sdkConfig,
    walletConfig: checkout.walletConfig,
    subvariant: 'custom',
    subvariantOptions: { custom: 'deposit' },
    ...widgetFromCheckout,
    ...widgetOverrides,
    variant: 'compact',
    languageResources: mergeLanguageResources(
      widgetFromCheckout?.languageResources,
      widgetOverrides?.languageResources
    ),
  }

  const resolvedProviders =
    merged.providers && merged.providers.length > 0
      ? merged.providers
      : Array.isArray(merged.providers) && merged.providers.length === 0
        ? merged.providers
        : getDefaultCheckoutWalletProviders()

  return {
    ...merged,
    providers: resolvedProviders,
    hiddenUI: mergeUniqueUiFlags(merged.hiddenUI, [
      HiddenUI.ToToken,
      HiddenUI.ReverseTokensButton,
    ]),
    disabledUI: mergeUniqueUiFlags(merged.disabledUI, [DisabledUI.ToToken]),
  }
}
