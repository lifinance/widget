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

    switch (value) {
      case 'drawer': {
        setHeader()

        const containerForDrawer = {
          ...getCurrentConfigTheme()?.container,
          maxHeight: undefined,
          display: undefined,
          height: '100%',
        }

        setContainer(containerForDrawer)
        break
      }
      case 'wide': {
        setHeader()

        const containerForWide = {
          ...getCurrentConfigTheme()?.container,
          // Reset values for Default layout (since they are different for Drawer variant)
          display: undefined,
          height: undefined,
        }

        setContainer(containerForWide)
        break
      }
      default:
    }
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
