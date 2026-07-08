import type {
  DefaultUI,
  InternalNavigationTabKey,
  ModeOptions,
  NavigationTabKey,
  RequiredUIConfig,
  SplitMode,
  SplitNavigationTabKey,
  WidgetConfig,
  WidgetMode,
  WidgetVariant,
} from '../../types/widget.js'
import { getSplitMode } from '../../utils/mode.js'
import type { NavigationTab } from './types.js'

/** Configured navigation tabs by key. Labels are resolved from the key by a hook. */
const navigationTabsByKey: Record<InternalNavigationTabKey, NavigationTab> = {
  default: {
    key: 'default',
    variant: 'wide',
    mode: 'default',
    defaultUI: {
      layout: 'cards',
    },
  },
  private: {
    key: 'private',
    variant: 'compact',
    mode: 'default',
    defaultUI: {
      layout: 'cards',
    },
    requiredUI: { toAddress: true },
  },
  refuel: {
    key: 'refuel',
    variant: 'wide',
    mode: 'refuel',
    defaultUI: {
      layout: 'cards',
    },
  },
  limit: {
    key: 'limit',
    variant: 'compact',
    mode: 'limit',
    defaultUI: {
      layout: 'cards',
    },
  },
  'swap-advanced': {
    key: 'swap-advanced',
    variant: 'wide',
    mode: 'split',
    modeOptions: { split: 'swap' },
    defaultUI: {
      layout: 'cards',
    },
  },
  'bridge-advanced': {
    key: 'bridge-advanced',
    variant: 'wide',
    mode: 'split',
    modeOptions: { split: 'bridge' },
    defaultUI: {
      layout: 'cards',
    },
  },
}

/** Split-mode tabs (Swap / Bridge), shown when no navigation tabs are configured. */
const splitTabs: NavigationTab[] = [
  {
    key: 'swap',
    mode: 'split',
    modeOptions: { split: 'swap' },
  },
  {
    key: 'bridge',
    mode: 'split',
    modeOptions: { split: 'bridge' },
  },
]

const splitTabsByKey = Object.fromEntries(
  splitTabs.map((tab) => [tab.key, tab])
) as Record<SplitNavigationTabKey, NavigationTab>

/** Combined lookup across configured and split tabs. */
const tabByKey: Record<NavigationTabKey, NavigationTab> = {
  ...navigationTabsByKey,
  ...splitTabsByKey,
}

/** Tab keys shown in split mode when no navigation tabs are configured. */
export const splitTabKeys: NavigationTabKey[] = splitTabs.map((tab) => tab.key)

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
  const tab = key ? tabByKey[key] : undefined
  return tab?.mode === 'split'
    ? getSplitMode(tab.modeOptions?.split)
    : undefined
}

/** Variant for a tab, falling back to the widget config's variant when unset. */
export const getTabVariant = (
  config: WidgetConfig,
  key?: NavigationTabKey
): WidgetVariant | undefined => {
  const tab = key ? tabByKey[key] : undefined
  return tab?.variant ?? config.variant
}

/** Mode for a tab, falling back to the widget config's mode when unset. */
export const getTabMode = (
  config: WidgetConfig,
  key?: NavigationTabKey
): WidgetMode | undefined => {
  const tab = key ? tabByKey[key] : undefined
  return tab?.mode ?? config.mode
}

/** Mode options for a tab, falling back to the widget config's when unset. */
export const getTabModeOptions = (
  config: WidgetConfig,
  key?: NavigationTabKey
): ModeOptions | undefined => {
  const tab = key ? tabByKey[key] : undefined
  return tab?.modeOptions ?? config.modeOptions
}

/**
 * Default UI for a tab, layered over the widget config's `defaultUI` so the
 * tab overrides only the fields it sets and inherits the rest.
 */
export const getTabDefaultUI = (
  config: WidgetConfig,
  key?: NavigationTabKey
): DefaultUI | undefined => {
  const tab = key ? tabByKey[key] : undefined
  if (!tab?.defaultUI) {
    return config.defaultUI
  }
  return { ...config.defaultUI, ...tab.defaultUI }
}

/**
 * Required UI for a tab, layered over the widget config's `requiredUI` so the
 * tab overrides only the fields it sets and inherits the rest.
 */
export const getTabRequiredUI = (
  config: WidgetConfig,
  key?: NavigationTabKey
): RequiredUIConfig | undefined => {
  const tab = key ? tabByKey[key] : undefined
  if (!tab?.requiredUI) {
    return config.requiredUI
  }
  return { ...config.requiredUI, ...tab.requiredUI }
}
