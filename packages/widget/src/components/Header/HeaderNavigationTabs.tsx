import type { JSX } from 'react'
import { useJumperTabLabel } from '../../stores/jumperVariant/useJumperTabLabel.js'
import { useJumperVariantStore } from '../../stores/jumperVariant/useJumperVariantStore.js'
import { getJumperTabs } from '../../stores/jumperVariant/utils.js'
import { HeaderTabs } from './HeaderTabs.js'

export const HeaderNavigationTabs = (): JSX.Element | null => {
  const [state, setState] = useJumperVariantStore((store) => [
    store.state,
    store.setState,
  ])
  const getLabel = useJumperTabLabel()

  if (!state) {
    return null
  }

  const tabs = getJumperTabs(state.tier)
  return (
    <HeaderTabs
      tabs={tabs.map((tab) => ({ key: tab.key, label: getLabel(tab.key) }))}
      value={state.tabKey}
      onChange={(tabKey) => setState({ tabKey })}
    />
  )
}
