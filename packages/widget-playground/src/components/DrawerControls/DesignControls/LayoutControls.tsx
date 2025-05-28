import { defaultMaxHeight } from '@lifi/widget'
import { MenuItem, type SelectChangeEvent } from '@mui/material'
import type { CSSProperties, FocusEventHandler } from 'react'
import {
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react'
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
  {
    id: 'fit-content',
    name: 'Fit content',
  },
]

const getLayoutMode = (container?: CSSProperties) => {
  let layoutMode: Layout = 'default'
  if (!container) {
    return layoutMode
  }

  if (container.display === 'flex' && container.height === '100%') {
    layoutMode = 'full-height'
  } else if (Number.isFinite(container.height)) {
    layoutMode = 'restricted-height'
  } else if (Number.isFinite(container.maxHeight)) {
    layoutMode = 'restricted-max-height'
  } else if (container.height === 'fit-content') {
    layoutMode = 'fit-content'
  }

  return layoutMode
}

export const LayoutControls = () => {
  const { config } = useConfig()

  const { variant } = useConfigVariant()
  const { showMockHeader } = useHeaderAndFooterToolValues()
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions()

  const { selectedLayoutId } = useLayoutValues()
  const { setSelectedLayoutId } = useEditToolsActions()
  const [heightValue, setHeightValue] = useState<number | undefined>()
  const [maxHeightValue, setMaxHeightValue] = useState<number | undefined>()

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
            display: 'flex',
            height: 'fit-content', // TODO: or max-content?
            maxHeight: undefined, // TODO: default? undefined?
          }

          setContainer(fullHeightContainer)
          break
        }
        default: {
          setHeightValue(undefined)
          setMaxHeightValue(undefined)
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

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    setHeightValue(undefined)
    setMaxHeightValue(undefined)
    const newLayoutId = event.target.value
    setInitialLayout(newLayoutId)
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
      <HeightControl
        selectedLayoutId={selectedLayoutId}
        setInitialLayout={setInitialLayout}
        heightValue={heightValue}
        setHeightValue={setHeightValue}
        maxHeightValue={maxHeightValue}
        setMaxHeightValue={setMaxHeightValue}
      />
    </ExpandableCard>
  )
}

const HeightControl = ({
  selectedLayoutId,
  setInitialLayout,
  heightValue,
  setHeightValue,
  maxHeightValue,
  setMaxHeightValue,
}: {
  selectedLayoutId: Layout
  setInitialLayout: (layoutId: Layout) => void
  heightValue: number | undefined
  setHeightValue: (height: number | undefined) => void
  maxHeightValue: number | undefined
  setMaxHeightValue: (height: number | undefined) => void
}) => {
  const inputId = useId()

  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()

  const handleHeightInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)
    const height = Number.isFinite(valueConvertedToNumber)
      ? valueConvertedToNumber
      : undefined

    setHeightValue(height)

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
  }

  const handleMaxHeightInputChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)
    const height = Number.isFinite(valueConvertedToNumber)
      ? valueConvertedToNumber
      : undefined

    setMaxHeightValue(height)

    if (getCurrentConfigTheme()?.header) {
      setHeader()
    }

    if (height && height >= defaultMaxHeight) {
      const newContainer = {
        ...(getCurrentConfigTheme()?.container ?? {}),
        maxHeight:
          height && height >= defaultMaxHeight ? height : defaultMaxHeight,
      }

      setContainer(newContainer)
    }
  }

  const handleHeightInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)

    if (valueConvertedToNumber < defaultMaxHeight) {
      setHeightValue(undefined)
      setInitialLayout(selectedLayoutId)
    }
  }

  const handleMaxHeightInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)

    if (valueConvertedToNumber < defaultMaxHeight) {
      setMaxHeightValue(undefined)
      setInitialLayout(selectedLayoutId)
    }
  }

  if (selectedLayoutId === 'restricted-height') {
    return (
      <CardRowContainer sx={{ padding: 1 }}>
        <CardRowColumn>
          <label htmlFor={inputId}>Set height</label>
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
          onChange={handleHeightInputChange}
          onBlur={handleHeightInputBlur}
        />
      </CardRowContainer>
    )
  }

  if (selectedLayoutId === 'restricted-max-height') {
    return (
      <CardRowContainer sx={{ padding: 1 }}>
        <CardRowColumn>
          <label htmlFor={inputId}>Set max height</label>
          {(maxHeightValue && maxHeightValue < defaultMaxHeight) ||
          !maxHeightValue ? (
            <CapitalizeFirstLetter variant="caption">
              {`${defaultMaxHeight}px minimum`}
            </CapitalizeFirstLetter>
          ) : null}
        </CardRowColumn>
        <Input
          id={inputId}
          type="number"
          value={maxHeightValue ?? ''}
          placeholder={`${defaultMaxHeight}`}
          onChange={handleMaxHeightInputChange}
          onBlur={handleMaxHeightInputBlur}
        />
      </CardRowContainer>
    )
  }

  if (selectedLayoutId === 'fit-content') {
    return (
      <CardRowColumn sx={{ padding: 1 }}>
        <CardRowContainer>
          <CardRowColumn>
            <label htmlFor={inputId}>Set max height</label>
            {(maxHeightValue && maxHeightValue < defaultMaxHeight) ||
            !maxHeightValue ? (
              <CapitalizeFirstLetter variant="caption">
                {`${defaultMaxHeight}px minimum`}
              </CapitalizeFirstLetter>
            ) : null}
          </CardRowColumn>
          <Input
            id={inputId}
            type="number"
            value={maxHeightValue ?? ''}
            placeholder={`${defaultMaxHeight}`}
            onChange={handleMaxHeightInputChange}
            onBlur={handleMaxHeightInputBlur}
          />
        </CardRowContainer>
        <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
          applied only to pages with long lists
        </CapitalizeFirstLetter>
      </CardRowColumn>
    )
  }

  if (selectedLayoutId === 'full-height') {
    return (
      <ControlRowContainer>
        <CapitalizeFirstLetter variant="caption" sx={{ paddingLeft: 1 }}>
          full height should be used with the compact variant
        </CapitalizeFirstLetter>
      </ControlRowContainer>
    )
  }

  return null
}
