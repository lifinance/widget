import type { WidgetVariant } from '@lifi/widget'
import type { SyntheticEvent } from 'react'
import { useConfigActions, useConfigVariant } from '../../../store'
import { CardValue, ExpandableCard } from '../../Card'
import { Tab, Tabs } from '../../Tabs'

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
          height: undefined,
        }

        containerForDrawer.display = undefined
        containerForDrawer.height = undefined
        containerForDrawer.maxHeight = undefined

        setContainer(containerForDrawer)
        break
      }
      case 'wide': {
        setHeader()

        const containerForWide = {
          ...getCurrentConfigTheme()?.container,
        }

        if (
          containerForWide.display === 'flex' &&
          containerForWide.height === '100%'
        ) {
          containerForWide.display = undefined
          containerForWide.height = undefined
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
