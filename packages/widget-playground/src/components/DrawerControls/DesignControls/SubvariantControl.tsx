import type { WidgetSubvariant } from '@lifi/widget'
import { Checkbox, FormControlLabel } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import {
  useConfigSubvariant,
  useConfigSubvariantOptions,
  useConfigVariant,
} from '../../../store/widgetConfig/useConfigValues'
import { CardValue } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
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
        <FormControlLabel
          control={
            <Checkbox
              checked={subvariantOptions?.wide?.enableChainSidebar || false}
              onChange={handleEnableChainSidebarChange}
            />
          }
          label="Enable chain sidebar"
          sx={{ padding: 1 }}
        />
      )}
    </ExpandableCard>
  )
}
