import { type JSX, useEffect, useRef } from 'react'
import { useWidgetEvents } from '../../hooks/useWidgetEvents.js'
import { useNavigationTabLabel } from '../../stores/navigationTabs/useNavigationTabLabel.js'
import { useNavigationTabsStore } from '../../stores/navigationTabs/useNavigationTabsStore.js'
import { WidgetEvent } from '../../types/events.js'
import type { NavigationTabKey } from '../../types/widget.js'
import { HeaderTabs } from './HeaderTabs.js'

export const HeaderNavigationTabs = (): JSX.Element | null => {
  const [tabs, activeTab, setActiveTab] = useNavigationTabsStore((store) => [
    store.tabs,
    store.activeTab,
    store.setActiveTab,
  ])
  const getLabel = useNavigationTabLabel()
  const emitter = useWidgetEvents()
  const previousTabRef = useRef<NavigationTabKey | undefined>(undefined)

  // Emit on the first resolved tab and on every subsequent switch.
  useEffect(() => {
    if (!activeTab || previousTabRef.current === activeTab) {
      return
    }
    emitter.emit(WidgetEvent.NavigationTabChanged, {
      tab: activeTab,
      previousTab: previousTabRef.current,
    })
    previousTabRef.current = activeTab
  }, [emitter, activeTab])

  if (!tabs.length || !activeTab) {
    return null
  }

  return (
    <HeaderTabs
      tabs={tabs.map((key) => ({ key, label: getLabel(key) }))}
      value={activeTab}
      onChange={(key) => setActiveTab(key)}
    />
  )
}
