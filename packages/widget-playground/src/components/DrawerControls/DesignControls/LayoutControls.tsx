import { defaultMaxHeight } from '@lifi/widget'
import { MenuItem, type SelectChangeEvent } from '@mui/material'
import type { CSSProperties, FocusEventHandler } from 'react'
import { type ChangeEventHandler, useEffect, useId, useState } from 'react'
import type { Layout } from '../../../store/editTools/types'
import { useEditToolsActions } from '../../../store/editTools/useEditToolsActions'
import { useHeaderAndFooterToolValues } from '../../../store/editTools/useHeaderAndFooterToolValues'
import { useLayoutValues } from '../../../store/editTools/useLayoutValues'
import { useConfig } from '../../../store/widgetConfig/useConfig'
import { useConfigActions } from '../../../store/widgetConfig/useConfigActions'
import { useConfigVariant } from '../../../store/widgetConfig/useConfigValues'
import {
  CardRowColumn,
  CardRowContainer,
  CardValue,
} from '../../Card/Card.style'
import { ExpandableCard } from '../../Card/ExpandableCard'
import { popperZIndex } from '../DrawerControls.style'
import {
  CapitalizeFirstLetter,
  ControlRowContainer,
  Input,
  Select,
} from './DesignControls.style'

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
]

interface InputLabel {
  [key: string]: string
}

const inputLabel: InputLabel = {
  'restricted-height': 'Set height',
  'restricted-max-height': 'Set max height',
}

const layoutsWithHeightControls: Layout[] = [
  'restricted-height',
  'restricted-max-height',
]

const getLayoutMode = (container?: CSSProperties) => {
  let layoutMode: Layout = 'default'
  if (
    container &&
    container?.display === 'flex' &&
    container?.height === '100%'
  ) {
    layoutMode = 'full-height'
  } else if (container && Number.isFinite(container?.height)) {
    layoutMode = 'restricted-height'
  } else if (container && Number.isFinite(container?.maxHeight)) {
    layoutMode = 'restricted-max-height'
  }
  return layoutMode
}

export const LayoutControls = () => {
  const inputId = useId()
  const { config } = useConfig()

  const { variant } = useConfigVariant()
  const { showMockHeader } = useHeaderAndFooterToolValues()
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions()

  const { selectedLayoutId } = useLayoutValues()
  const { setSelectedLayoutId } = useEditToolsActions()
  const [heightValue, setHeightValue] = useState<number | undefined>()

  useEffect(() => {
    setSelectedLayoutId(getLayoutMode(config?.theme?.container))
  }, [config?.theme?.container, setSelectedLayoutId])

  const setInitialLayout = (layoutId: Layout) => {
    switch (layoutId) {
      case 'restricted-height': {
        setHeader()

        const heightContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          height: defaultMaxHeight,
          display: undefined,
          maxHeight: undefined,
        }
        heightContainer.display = undefined
        heightContainer.maxHeight = undefined

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
        maxHeightContainer.display = undefined
        maxHeightContainer.height = undefined

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
        fullHeightContainer.maxHeight = undefined

        setContainer(fullHeightContainer)
        break
      }
      default: {
        setHeightValue(undefined)
        setHeader()

        const defaultContainer = {
          ...(getCurrentConfigTheme()?.container ?? {}),
          maxHeight: undefined,
          display: undefined,
          height: undefined,
        }
        defaultContainer.display = undefined
        defaultContainer.height = undefined
        defaultContainer.maxHeight = undefined

        setContainer(defaultContainer)
      }
    }
  }

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    setHeightValue(undefined)
    const newLayoutId = event.target.value
    setInitialLayout(newLayoutId)
  }

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)

    if (valueConvertedToNumber < defaultMaxHeight) {
      setHeightValue(undefined)
      setInitialLayout(selectedLayoutId)
    }
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)
    const height = Number.isFinite(valueConvertedToNumber)
      ? valueConvertedToNumber
      : undefined

    setHeightValue(height)

    switch (selectedLayoutId) {
      case 'restricted-height':
        if (getCurrentConfigTheme()?.header) {
          setHeader()
        }

        if (height && height >= defaultMaxHeight) {
          const containerWithMaxHeight = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            height,
          }

          setContainer(containerWithMaxHeight)
        }
        break
      default:
        if (getCurrentConfigTheme()?.header) {
          setHeader()
        }

        if (height && height >= defaultMaxHeight) {
          const newContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: height,
          }

          setContainer(newContainer)
        }

        if (!height) {
          const newContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: defaultMaxHeight,
          }

          setContainer(newContainer)
        }
    }
  }

  return (
    <ExpandableCard
      title="Layout"
      value={
        <CardValue sx={{ textTransform: 'capitalize' }}>
          {layoutOptions.find((option) => option.id === selectedLayoutId)
            ?.name || ''}
        </CardValue>
      }
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
      {layoutsWithHeightControls.includes(selectedLayoutId) ? (
        <CardRowContainer sx={{ padding: 1 }}>
          <CardRowColumn>
            <label htmlFor={inputId}>{inputLabel[selectedLayoutId]}</label>
            {(heightValue && heightValue < defaultMaxHeight) || !heightValue ? (
              <CapitalizeFirstLetter variant="caption">
                {`${defaultMaxHeight}px minimum`}
              </CapitalizeFirstLetter>
            ) : null}
          </CardRowColumn>
          <Input
            id={inputId}
            type="number"
            value={heightValue ?? ''}
            placeholder={`${defaultMaxHeight}`}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </CardRowContainer>
      ) : null}
      {selectedLayoutId === 'full-height' ? (
        <ControlRowContainer>
          <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
            full height should be used with the compact variant
          </CapitalizeFirstLetter>
        </ControlRowContainer>
      ) : null}
    </ExpandableCard>
  )
}
