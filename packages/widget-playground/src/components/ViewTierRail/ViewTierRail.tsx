import CandlestickChartOutlined from '@mui/icons-material/CandlestickChartOutlined'
import SwapHorizOutlined from '@mui/icons-material/SwapHorizOutlined'
import { Tooltip } from '@mui/material'
import type { JSX, SyntheticEvent } from 'react'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useConfigNavigationTabs } from '../../store/widgetConfig/useConfigValues.js'
import {
  ADVANCED_NAVIGATION_TABS,
  NAVIGATION_TAB_TIERS,
} from '../../utils/tabs.js'
import { RailTab, RailTabs } from './ViewTierRail.style.js'

export function ViewTierRail(): JSX.Element {
  const { navigationTabs } = useConfigNavigationTabs()
  const { setNavigationTabs } = useConfigActions()

  const isAdvanced = navigationTabs?.[0] === ADVANCED_NAVIGATION_TABS[0]

  const handleChange = (_: SyntheticEvent, newValue: number): void => {
    setNavigationTabs(NAVIGATION_TAB_TIERS[newValue])
  }

  return (
    <RailTabs
      orientation="vertical"
      value={isAdvanced ? 1 : 0}
      onChange={handleChange}
      aria-label="Widget view"
    >
      <Tooltip title="Simple" placement="left" arrow>
        <RailTab
          icon={<SwapHorizOutlined />}
          aria-label="Simple"
          disableRipple
        />
      </Tooltip>
      <Tooltip title="Advanced" placement="left" arrow>
        <RailTab
          icon={<CandlestickChartOutlined />}
          aria-label="Advanced"
          disableRipple
        />
      </Tooltip>
    </RailTabs>
  )
}
