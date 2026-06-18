import type {
  NavigationTabKey,
  SplitMode,
  WidgetConfig,
} from '../../types/widget.js'
import { getSplitMode } from '../../utils/mode.js'
import type { NavigationTab } from './types.js'

/** All navigation tabs by key. Labels are resolved from the key by a hook. */
const navigationTabsByKey: Record<NavigationTabKey, NavigationTab> = {
  default: { key: 'default', mode: 'default' },
  private: { key: 'private', mode: 'split', modeOptions: { split: 'swap' } },
  refuel: { key: 'refuel', mode: 'refuel' },
  limit: { key: 'limit', mode: 'limit' },
  'swap-advanced': {
    key: 'swap-advanced',
    mode: 'split',
    modeOptions: { split: 'swap' },
  },
  'bridge-advanced': {
    key: 'bridge-advanced',
    mode: 'split',
    modeOptions: { split: 'bridge' },
  },
  swap: { key: 'swap', mode: 'split', modeOptions: { split: 'swap' } },
  bridge: { key: 'bridge', mode: 'split', modeOptions: { split: 'bridge' } },
}

/** Tab keys shown in split mode when no navigation tabs are configured. */
export const splitTabKeys: NavigationTabKey[] = ['swap', 'bridge']

/** Resolves which navigation tabs the header should render from the config. */
export const getNavigationTabKeys = (
  config: WidgetConfig
): NavigationTabKey[] => {
  if (config._navigationTabs?.length) {
    return config._navigationTabs
  }
  // Split mode shows Swap / Bridge tabs unless pinned to a single side.
  if (
    config.mode === 'split' &&
    typeof config.modeOptions?.split !== 'string'
  ) {
    return splitTabKeys
  }
  return []
}

/**
 * The tab the store seeds as active from the config. With navigation tabs it's
 * the first configured tab; otherwise split mode's selection is itself a tab
 * (`swap`/`bridge`), so it seeds the active tab too.
 */
export const getInitialActiveTab = (
  config: WidgetConfig
): NavigationTabKey | undefined => {
  if (config._navigationTabs?.length) {
    return config._navigationTabs[0]
  }
  return config.mode === 'split'
    ? getSplitMode(config.modeOptions?.split)
    : undefined
}

/** Split mode (`swap`/`bridge`) implied by a tab, or `undefined` if not split. */
export const getTabSplitMode = (
  key?: NavigationTabKey
): SplitMode | undefined => {
  const tab = key ? navigationTabsByKey[key] : undefined
  return tab?.mode === 'split'
    ? getSplitMode(tab.modeOptions?.split)
    : undefined
}
