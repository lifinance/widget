import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useNavigationTabsStore } from './useNavigationTabsStore.js'
import { getTabMode } from './utils.js'

/**
 * Whether the widget is currently in limit-order mode — true when the active
 * navigation tab resolves to `mode: 'limit'`, or (with no tabs) when the
 * config mode is `'limit'`. `getTabMode` falls back to `config.mode` when the
 * tab carries no mode, so this covers both the tab-driven and config-driven
 * cases.
 */
export const useLimitMode = (): boolean => {
  const config = useWidgetConfig()
  const activeTab = useNavigationTabsStore((store) => store.activeTab)
  return getTabMode(config, activeTab) === 'limit'
}
