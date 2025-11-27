import type { WidgetVariant } from '@lifi/widget'
import type { SyntheticEvent } from 'react'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfigVariant } from '../../../store/widgetConfig/useConfigValues'
import { CardValue } from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { Tab, Tabs } from '../../Tabs/Tabs.style'

export const VariantControl = () => {
  const { variant } = useConfigVariant()
  const { setVariant, setHeader, setContainer, getCurrentConfigTheme } =
    useConfigActions()

  const handleVariantChange = (_: SyntheticEvent, value: WidgetVariant) => {
    setVariant(value)
    setHeader()

    const baseContainer = getCurrentConfigTheme()?.container || {}

    const containerConfig =
      value === 'drawer'
        ? {
            ...baseContainer,
            maxHeight: undefined,
            display: undefined,
            height: '100%',
          }
        : {
            ...baseContainer,
            display: undefined,
            height: undefined,
          }

    setContainer(containerConfig)
  }

  return (
    <ExpandableCard
      title={'Variant'}
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>{variant}</CardValue>
      }
    >
      <Tabs
        value={variant}
        aria-label="tabs"
        indicatorColor="primary"
        onChange={handleVariantChange}
        sx={{ mt: 0.5 }}
        orientation="vertical"
      >
        <Tab label="Compact" value={'compact'} disableRipple />
        <Tab label="Wide" value={'wide'} disableRipple />
        <Tab label="Drawer" value={'drawer'} disableRipple />
      </Tabs>
    </ExpandableCard>
  )
}
