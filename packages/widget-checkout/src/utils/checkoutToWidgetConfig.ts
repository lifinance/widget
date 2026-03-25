import {
  DisabledUI,
  deepMerge,
  HiddenUI,
  type WidgetConfig,
} from '@lifi/widget'
import checkoutEn from '../i18n/en.json' with { type: 'json' }
import type { CheckoutConfig } from '../types/checkout.js'
import { checkoutThemeToWidgetTheme } from './checkoutThemeToWidgetTheme.js'
import { getDefaultCheckoutWalletProviders } from './defaultCheckoutWalletProviders.js'

function buildCheckoutLanguageResources(
  widgetFromCheckout: Partial<WidgetConfig> | undefined,
  widgetOverrides: Partial<WidgetConfig> | undefined
): WidgetConfig['languageResources'] {
  const baseEn = structuredClone(checkoutEn) as Record<string, unknown>
  const fromCheckout = widgetFromCheckout?.languageResources
  const fromOverrides = widgetOverrides?.languageResources
  const enMerged = deepMerge(
    baseEn,
    (fromCheckout?.en ?? {}) as Record<string, unknown>,
    (fromOverrides?.en ?? {}) as Record<string, unknown>
  ) as Record<string, unknown>

  const otherKeys = new Set([
    ...Object.keys(fromCheckout ?? {}),
    ...Object.keys(fromOverrides ?? {}),
  ])
  otherKeys.delete('en')

  const merged: Record<string, unknown> = {
    ...fromCheckout,
    ...fromOverrides,
    en: enMerged,
  }

  for (const key of otherKeys) {
    const a = fromCheckout?.[key as keyof NonNullable<typeof fromCheckout>]
    const b = fromOverrides?.[key as keyof NonNullable<typeof fromOverrides>]
    merged[key] = deepMerge(
      (typeof a === 'object' && a ? a : {}) as Record<string, unknown>,
      (typeof b === 'object' && b ? b : {}) as Record<string, unknown>
    ) as Record<string, unknown>
  }

  return merged as WidgetConfig['languageResources']
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
    languageResources: buildCheckoutLanguageResources(
      widgetFromCheckout,
      widgetOverrides
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
