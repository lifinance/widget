import type { Theme } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { useNavigationTabsStore } from '../stores/navigationTabs/useNavigationTabsStore.js'
import { getTabVariant } from '../stores/navigationTabs/utils.js'

const defaultExpandableWidth = 852

export const useWideVariant = (): boolean => {
  const config = useWidgetConfig()
  const activeTab = useNavigationTabsStore((store) => store.activeTab)
  // The active tab can pin its own variant (e.g. the limit tab is compact),
  // falling back to the widget config's variant when it doesn't.
  const variant = getTabVariant(config, activeTab)
  const expandableAllowed = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(defaultExpandableWidth)
  )
  return variant === 'wide' && expandableAllowed && !config.showSingleRoute
}
