import { defaultMaxHeight } from '@lifi/widget'
import { MenuItem, type SelectChangeEvent } from '@mui/material'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { Layout } from '../../../../store/editTools/types.js'
import { useEditToolsActions } from '../../../../store/editTools/useEditToolsActions.js'
import { useHeaderAndFooterToolValues } from '../../../../store/editTools/useHeaderAndFooterToolValues.js'
import { useLayoutValues } from '../../../../store/editTools/useLayoutValues.js'
import { useConfig } from '../../../../store/widgetConfig/useConfig.js'
import { useConfigActions } from '../../../../store/widgetConfig/useConfigActions.js'
import { useConfigVariant } from '../../../../store/widgetConfig/useConfigValues.js'
import { CardValue } from '../../../Card/Card.style.js'
import { ExpandableCard } from '../../../Card/ExpandableCard.js'
import { popperZIndex } from '../../DrawerControls.style.js'
import { ControlRowContainer, Select } from '../DesignControls.style.js'
import { HeightControl } from './HeightControl.js'

interface LayoutOption {
  id: Layout
  name: string
}

const layoutOptions: LayoutOption[] = [
  {
    id: 'default',
    name: 'Default',
  },
  {
    id: 'restricted-max-height',
    name: 'Restricted Max Height',
  },
  {
    id: 'restricted-height',
    name: 'Restricted Height',
  },
  {
    id: 'full-height',
    name: 'Full Height',
  },
  {
    id: 'fit-content',
    name: 'Fit Content',
  },
]

const getLayoutMode = (container?: CSSProperties) => {
  let layoutMode: Layout = 'default'
  if (!container) {
    return layoutMode
  }

  if (container.display === 'flex' && container.height === '100%') {
    layoutMode = 'full-height'
  } else if (container.height === 'fit-content') {
    layoutMode = 'fit-content'
  } else if (Number.isFinite(container.height)) {
    layoutMode = 'restricted-height'
  } else if (Number.isFinite(container.maxHeight)) {
    layoutMode = 'restricted-max-height'
  }

  return layoutMode
}

export const LayoutControl = () => {
  const { config } = useConfig()

  const { variant } = useConfigVariant()
  const { showMockHeader } = useHeaderAndFooterToolValues()
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions()

  const { selectedLayoutId } = useLayoutValues()
  const { setSelectedLayoutId } = useEditToolsActions()
  const [heightValue, setHeightValue] = useState<number | undefined>() // height or maxHeight, depending on selectedLayoutId

  useEffect(() => {
    setSelectedLayoutId(getLayoutMode(config?.theme?.container))
  }, [config?.theme?.container, setSelectedLayoutId])

  const setInitialLayout = useCallback(
    (layoutId: Layout) => {
      switch (layoutId) {
        case 'restricted-height': {
          setHeader()

          const heightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            height: defaultMaxHeight,
            display: undefined,
            maxHeight: undefined,
          }

          setContainer(heightContainer)

          break
        }
        case 'restricted-max-height': {
          setHeader()

          const maxHeightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: defaultMaxHeight,
            display: undefined,
            height: undefined,
          }

          setContainer(maxHeightContainer)

          break
        }
        case 'full-height': {
          setVariant('compact')

          setHeader({
            position: 'fixed',
            top: showMockHeader ? 48 : 0,
          })

          const fullHeightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            display: 'flex',
            height: '100%',
            maxHeight: undefined,
          }

          setContainer(fullHeightContainer)
          break
        }
        case 'fit-content': {
          setHeader()

          const fullHeightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            display: undefined,
            height: 'fit-content',
            maxHeight: defaultMaxHeight,
          }

          setContainer(fullHeightContainer)
          break
        }
        default: {
          setHeightValue(undefined)
          setHeader()

          const defaultContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            display: undefined,
            height: undefined,
            maxHeight: undefined,
          }

          setContainer(defaultContainer)
        }
      }
    },
    [getCurrentConfigTheme, setContainer, setHeader, setVariant, showMockHeader]
  )

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent<any>) => {
      setHeightValue(undefined)
      const newLayoutId = event.target.value as Layout
      setInitialLayout(newLayoutId)
    },
    [setInitialLayout]
  )

  return (
    <ExpandableCard
      title="Layout"
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {layoutOptions.find((option) => option.id === selectedLayoutId)
            ?.name || ''}
        </CardValue>
      }
      dataTestId="layout-section"
    >
      <ControlRowContainer
        sx={selectedLayoutId !== 'default' ? { paddingBottom: 0 } : undefined}
      >
        <Select
          value={selectedLayoutId ?? ''}
          onChange={handleSelectChange}
          aria-label="Layout"
          MenuProps={{ sx: { zIndex: popperZIndex } }}
          disabled={variant === 'drawer'}
        >
          {layoutOptions?.map(({ name, id }: LayoutOption) => {
            return (
              <MenuItem value={id} key={id}>
                {name}
              </MenuItem>
            )
          })}
        </Select>
      </ControlRowContainer>
      <HeightControl
        selectedLayoutId={selectedLayoutId}
        setInitialLayout={setInitialLayout}
        heightValue={heightValue}
        setHeightValue={setHeightValue}
      />
    </ExpandableCard>
  )
}
