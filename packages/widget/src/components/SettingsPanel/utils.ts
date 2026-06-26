import type { NavigationTabKey } from '../../types/widget.js'

export type SettingsPanelKey =
  | 'routePriority'
  | 'exchanges'
  | 'bridges'
  | 'slippage'

/** Navigation tabs that surface the settings panel on the main page. */
export const advancedNavigationTabKeys: NavigationTabKey[] = [
  'swap-advanced',
  'bridge-advanced',
]

// Keys are ordered to match the settings page layout.
// Swap is same-chain, so route priority and bridges are not relevant.
export const swapSettingsPanelKeys: SettingsPanelKey[] = [
  'slippage',
  'exchanges',
]

export const bridgeSettingsPanelKeys: SettingsPanelKey[] = [
  'routePriority',
  'slippage',
  'bridges',
  'exchanges',
]
