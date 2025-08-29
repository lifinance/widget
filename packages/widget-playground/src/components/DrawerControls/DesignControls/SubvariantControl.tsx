import type { SplitSubvariant, WidgetSubvariant } from '@lifi/widget'
import type { SyntheticEvent } from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import {
  useConfigSubvariant,
  useConfigSubvariantOptions,
  useConfigVariant,
} from '../../../store/widgetConfig/useConfigValues.js'
import { CardRowContainer, CardValue } from '../../Card/Card.style.js'
import { ExpandableCard } from '../../Card/ExpandableCard.js'
import { Switch } from '../../Switch.js'
import { Tab, Tabs } from '../../Tabs/Tabs.style.js'

export const SubvariantControl = () => {
  const { variant } = useConfigVariant()
  const { subvariant } = useConfigSubvariant()
  const { subvariantOptions } = useConfigSubvariantOptions()
  const { setSubvariant, setSplitOption, setChainSidebarEnabled } =
    useConfigActions()

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

  const handleSplitOptionChange = (
    _: SyntheticEvent,
    value: SplitSubvariant | 'default'
  ) => {
    setSplitOption(value === 'default' ? undefined : value)
  }

  return (
    <ExpandableCard
      title={'Subvariant'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>{subvariant}</CardValue>
      }
      data-testid="subvariant-section"
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
      {subvariant === 'split' && (
        <Tabs
          value={subvariantOptions?.split || 'default'}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={handleSplitOptionChange}
          sx={{ mt: 1 }}
        >
          <Tab label="Default" value={'default'} disableRipple />
          <Tab label="Bridge" value={'bridge'} disableRipple />
          <Tab label="Swap" value={'swap'} disableRipple />
        </Tabs>
      )}
      {variant === 'wide' && (
        <CardRowContainer sx={{ paddingLeft: 1, paddingRight: 1 }}>
          Enable chain sidebar
          <Switch
            checked={!!subvariantOptions?.wide?.enableChainSidebar}
            onChange={handleEnableChainSidebarChange}
            aria-label="Enable chain sidebar"
          />
        </CardRowContainer>
      )}
    </ExpandableCard>
  )
}
