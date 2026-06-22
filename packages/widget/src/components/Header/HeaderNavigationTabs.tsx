import type { JSX } from 'react'
import { useNavigationTabLabel } from '../../stores/navigationTabs/useNavigationTabLabel.js'
import { useNavigationTabsStore } from '../../stores/navigationTabs/useNavigationTabsStore.js'
import { useRouteExecutionIndicator } from '../../stores/routes/useRouteExecutionIndicator.js'
import { HeaderTabs } from './HeaderTabs.js'

export const HeaderNavigationTabs = (): JSX.Element | null => {
  const [tabs, activeTab, setActiveTab] = useNavigationTabsStore((store) => [
    store.tabs,
    store.activeTab,
    store.setActiveTab,
  ])
  const getLabel = useNavigationTabLabel()
  // Lock tab switching while a route is executing — switching tabs can change
  // the SDK config (e.g. apiUrl), which must not happen mid-execution.
  const { active: isExecuting } = useRouteExecutionIndicator()

  if (!tabs.length || !activeTab) {
    return null
  }

  return (
    <HeaderTabs
      tabs={tabs.map((key) => ({ key, label: getLabel(key) }))}
      value={activeTab}
      onChange={(key) => setActiveTab(key)}
      disabled={isExecuting}
    />
  )
}
