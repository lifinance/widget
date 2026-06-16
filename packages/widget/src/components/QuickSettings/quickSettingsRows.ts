import type { NavigationTabKey } from '../../types/widget.js'

export type QuickSettingKey =
  | 'routeType'
  | 'routePriority'
  | 'exchanges'
  | 'bridges'
  | 'slippage'

/** Navigation tabs that surface quick settings on the main page. */
export const advancedNavigationTabKeys: NavigationTabKey[] = [
  'swap-advanced',
  'bridge-advanced',
]

interface QuickSettingConfig {
  /** i18n key for the row label. */
  labelKey: string
  /** Dedicated settings sub-route to navigate to. */
  route: 'bridges' | 'exchanges' | 'routeType' | 'routePriority' | 'slippage'
}

export const quickSettingsConfig: Record<QuickSettingKey, QuickSettingConfig> =
  {
    routeType: {
      labelKey: 'settings.routeType.title',
      route: 'routeType',
    },
    routePriority: {
      labelKey: 'settings.routePriority',
      route: 'routePriority',
    },
    exchanges: {
      labelKey: 'settings.enabledExchanges',
      route: 'exchanges',
    },
    bridges: {
      labelKey: 'settings.enabledBridges',
      route: 'bridges',
    },
    slippage: {
      labelKey: 'settings.slippage',
      route: 'slippage',
    },
  }

// Swap is same-chain, so bridges are not relevant.
export const swapQuickSettings: QuickSettingKey[] = [
  'routeType',
  'exchanges',
  'slippage',
]

export const bridgeQuickSettings: QuickSettingKey[] = [
  'routePriority',
  'exchanges',
  'bridges',
  'slippage',
]
