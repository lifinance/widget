import type { SyntheticEvent } from 'react'
import type { PlaygroundWidgetMode } from '../../../store/widgetConfig/types.js'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions.js'
import { usePlaygroundWidgetMode } from '../../../store/widgetConfig/useConfigValues.js'
import { CardValue } from '../../Card/Card.style.js'
import { ExpandableCard } from '../../Card/ExpandableCard.js'
import { Tab, Tabs } from '../../Tabs/Tabs.style.js'

const modeLabels: Record<PlaygroundWidgetMode, string> = {
  swap: 'Swap / bridge',
  checkout: 'Checkout (Path v1)',
}

export const WidgetModeControl = () => {
  const { playgroundWidgetMode } = usePlaygroundWidgetMode()
  const { setPlaygroundWidgetMode } = useConfigActions()

  const handleChange = (_: SyntheticEvent, value: PlaygroundWidgetMode) => {
    if (value === 'swap' || value === 'checkout') {
      setPlaygroundWidgetMode(value)
    }
  }

  return (
    <ExpandableCard
      title="Widget mode"
      value={
        <CardValue sx={{ textTransform: 'none' }}>
          {modeLabels[playgroundWidgetMode]}
        </CardValue>
      }
    >
      <Tabs
        value={playgroundWidgetMode}
        aria-label="Playground widget mode"
        indicatorColor="primary"
        onChange={handleChange}
        sx={{ mt: 0.5 }}
        orientation="vertical"
      >
        <Tab label={modeLabels.swap} value="swap" disableRipple />
        <Tab label={modeLabels.checkout} value="checkout" disableRipple />
      </Tabs>
    </ExpandableCard>
  )
}
