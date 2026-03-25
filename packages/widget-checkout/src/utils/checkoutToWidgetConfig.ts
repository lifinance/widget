import type { WidgetConfig } from '@lifi/widget'
import type { CheckoutConfig } from '../types/checkout.js'
import { checkoutThemeToWidgetTheme } from './checkoutThemeToWidgetTheme.js'
import { getDefaultCheckoutWalletProviders } from './defaultCheckoutWalletProviders.js'

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
    ...checkout.widget,
    ...widgetOverrides,
    variant: 'compact',
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
  }
}
