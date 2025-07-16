import type { WidgetSubvariant } from '@lifi/widget'
import type { SyntheticEvent } from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import {
  useConfigSubvariant,
  useConfigSubvariantOptions,
  useConfigVariant,
} from '../../../store/widgetConfig/useConfigValues'
import { CardRowContainer, CardValue } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { Switch } from '../../Switch'
import { Tab, Tabs } from '../../Tabs/Tabs.style'

export const SubvariantControl = () => {
  const { variant } = useConfigVariant()
  const { subvariant } = useConfigSubvariant()
  const { subvariantOptions } = useConfigSubvariantOptions()
  const { setSubvariant, setChainSidebarEnabled } = useConfigActions()

  const handleSubvariantChange = (
    _: SyntheticEvent,
    value: WidgetSubvariant
  ) => {
    setSubvariant(value)
  }

  const handleEnableChainSidebarChange = (
    _: SyntheticEvent,
    value: boolean
  ) => {
    setChainSidebarEnabled(value)
  }

  return (
    <ExpandableCard
      title={'Subvariant'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>{subvariant}</CardValue>
      }
    >
      <Tabs
        value={subvariant}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleSubvariantChange}
        sx={{ mt: 0.5 }}
      >
        <Tab label="Default" value={'default'} disableRipple />
        <Tab label="Split" value={'split'} disableRipple />
        <Tab label="Refuel" value={'refuel'} disableRipple />
      </Tabs>
      {variant === 'wide' && (
        <CardRowContainer sx={{ paddingLeft: 1, paddingRight: 1 }}>
          Enable chain sidebar
          <Switch
            checked={subvariantOptions?.wide?.enableChainSidebar ?? true}
            onChange={handleEnableChainSidebarChange}
            aria-label="Enable chain sidebar"
          />
        </CardRowContainer>
      )}
    </ExpandableCard>
  )
}
