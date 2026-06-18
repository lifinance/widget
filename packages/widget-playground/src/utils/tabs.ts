import type { NavigationTabKey } from '@lifi/widget'

/**
 * Navigation tab sets toggled by the jumper rail. The rail writes one of these
 * lists into `config._navigationTabs`; the widget renders the tabs.
 */
export const SIMPLE_NAVIGATION_TABS: NavigationTabKey[] = [
  'default',
  'private',
  'refuel',
]
export const ADVANCED_NAVIGATION_TABS: NavigationTabKey[] = [
  'swap-advanced',
  'bridge-advanced',
  'limit',
]

/** Tab sets indexed by rail position (0: simple, 1: advanced). */
export const NAVIGATION_TAB_TIERS: NavigationTabKey[][] = [
  SIMPLE_NAVIGATION_TABS,
  ADVANCED_NAVIGATION_TABS,
]
