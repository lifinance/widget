import type {
  NavigationTabConfig,
  NavigationTabKey,
  WidgetConfig,
} from '../../types/widget.js'
import { getSplitMode } from '../../utils/mode.js'

/** Split-mode tabs (Swap / Bridge), shown when no navigation tabs are configured. */
const splitTabs: NavigationTabConfig[] = [
  { tabKey: 'swap', config: { mode: 'split', modeOptions: { split: 'swap' } } },
  {
    tabKey: 'bridge',
    config: { mode: 'split', modeOptions: { split: 'bridge' } },
  },
]

/** Resolves which navigation tabs the header should render from the config. */
export const getNavigationTabs = (
  config: WidgetConfig
): NavigationTabConfig[] => {
  if (config._navigationTabs?.length) {
    return config._navigationTabs
  }
  // Split mode shows Swap / Bridge tabs unless pinned to a single side.
  if (
    config.mode === 'split' &&
    typeof config.modeOptions?.split !== 'string'
  ) {
    return splitTabs
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
    return config._navigationTabs[0].tabKey
  }
  return config.mode === 'split'
    ? getSplitMode(config.modeOptions?.split)
    : undefined
}
