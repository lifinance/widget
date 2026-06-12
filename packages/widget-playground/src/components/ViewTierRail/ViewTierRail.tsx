import type { WidgetMode } from '@lifi/widget'
import { Tooltip } from '@mui/material'
import type { JSX, SyntheticEvent } from 'react'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useConfigMode } from '../../store/widgetConfig/useConfigValues.js'
import { RailTab, RailTabs } from './ViewTierRail.style.js'
import { AdvancedIcon, SimpleIcon } from './ViewTierRailIcons.js'

const modeIndexMap: Record<string, number> = {
  'jumper-simple': 0,
  'jumper-advanced': 1,
}

const indexModeMap: WidgetMode[] = ['jumper-simple', 'jumper-advanced']

export function ViewTierRail(): JSX.Element {
  const { mode } = useConfigMode()
  const { setMode } = useConfigActions()

  const handleChange = (_: SyntheticEvent, newValue: number): void => {
    setMode(indexModeMap[newValue])
  }

  return (
    <RailTabs
      orientation="vertical"
      value={modeIndexMap[mode ?? ''] ?? 0}
      onChange={handleChange}
      aria-label="Widget view"
    >
      <Tooltip title="Simple" placement="left" arrow>
        <RailTab icon={<SimpleIcon />} aria-label="Simple" />
      </Tooltip>
      <Tooltip title="Advanced" placement="left" arrow>
        <RailTab icon={<AdvancedIcon />} aria-label="Advanced" />
      </Tooltip>
    </RailTabs>
  )
}
