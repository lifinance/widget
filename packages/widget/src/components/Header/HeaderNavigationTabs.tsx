import type { JSX } from 'react'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useHeaderTabsStore } from '../../stores/headerTabs/useHeaderTabsStore.js'
import { NavigationTab, NavigationTabs } from '../Tabs/NavigationTabs.js'

export const HeaderNavigationTabs = (): JSX.Element | null => {
  const { setFieldValue } = useFieldActions()

  const [activeTab, setActiveTab, tabs] = useHeaderTabsStore((state) => [
    state.activeTab,
    state.setActiveTab,
    state.tabs,
  ])

  const activeIndex = activeTab ? tabs.indexOf(activeTab) : 0

  const handleChange = (_: React.SyntheticEvent, index: number) => {
    const tab = tabs[index]
    if (tab) {
      setFieldValue('fromAmount', '')
      setFieldValue('fromToken', '')
      setFieldValue('toToken', '')
      setActiveTab(tab)
    }
  }

  return (
    <NavigationTabs
      value={activeIndex}
      onChange={handleChange}
      aria-label="tabs"
    >
      {tabs.map((tab) => (
        <NavigationTab key={tab.label} label={tab.label} disableRipple />
      ))}
    </NavigationTabs>
  )
}
