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
  } else if (
    container.height === 'fit-content' &&
    container.maxHeight === undefined
  ) {
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
  const [generalHeightValue, setGeneralHeightValue] = useState<
    number | undefined
  >()
  const [listHeightValue, setListHeightValue] = useState<number | undefined>()

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
            listPageMaxHeight: undefined,
          }

          setContainer(heightContainer)

          break
        }
        case 'restricted-max-height': {
          setHeader()

          const maxHeightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: defaultMaxHeight,
            listPageMaxHeight: defaultMaxHeight,
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
            listPageMaxHeight: undefined,
          }

          setContainer(fullHeightContainer)
          break
        }
        case 'fit-content': {
          const fullHeightContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            display: 'flex',
            height: 'fit-content',
            maxHeight: undefined,
            listPageMaxHeight: undefined,
          }

          setContainer(fullHeightContainer)
          break
        }
        default: {
          setGeneralHeightValue(undefined)
          setListHeightValue(undefined)
          setHeader()

          const defaultContainer = {
            ...(getCurrentConfigTheme()?.container ?? {}),
            maxHeight: undefined,
            listPageMaxHeight: undefined,
            display: undefined,
            height: undefined,
          }

          setContainer(defaultContainer)
        }
      }
    },
    [getCurrentConfigTheme, setContainer, setHeader, setVariant, showMockHeader]
  )

  const handleSelectChange = (event: SelectChangeEvent<any>) => {
    setGeneralHeightValue(undefined)
    setListHeightValue(undefined)
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
        generalHeightValue={generalHeightValue}
        setGeneralHeightValue={setGeneralHeightValue}
        listHeightValue={listHeightValue}
        setListHeightValue={setListHeightValue}
      />
    </ExpandableCard>
  )
}

const HeightControl = ({
  selectedLayoutId,
  setInitialLayout,
  generalHeightValue,
  setGeneralHeightValue,
  listHeightValue,
  setListHeightValue,
}: {
  selectedLayoutId: Layout
  setInitialLayout: (layoutId: Layout) => void
  generalHeightValue: number | undefined
  setGeneralHeightValue: (height: number | undefined) => void
  listHeightValue: number | undefined
  setListHeightValue: (height: number | undefined) => void
}) => {
  const inputId1 = useId()
  const inputId2 = useId()

  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()

  const handleHeightInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)
    const height = Number.isFinite(valueConvertedToNumber)
      ? valueConvertedToNumber
      : undefined

    setGeneralHeightValue(height)

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

  const handleGeneralMaxHeightInputChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)
    const height = Number.isFinite(valueConvertedToNumber)
      ? valueConvertedToNumber
      : undefined

    setGeneralHeightValue(height)

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

  const handleListMaxHeightInputChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)
    const height = Number.isFinite(valueConvertedToNumber)
      ? valueConvertedToNumber
      : undefined

    setListHeightValue(height)

    if (getCurrentConfigTheme()?.header) {
      setHeader()
    }

    if (height && height >= defaultMaxHeight) {
      const newContainer = {
        ...(getCurrentConfigTheme()?.container ?? {}),
        listPageMaxHeight: height,
      }

      setContainer(newContainer)
    }

    if (!height) {
      const newContainer = {
        ...(getCurrentConfigTheme()?.container ?? {}),
        listPageMaxHeight: defaultMaxHeight,
      }

      setContainer(newContainer)
    }
  }

  const handleGeneralInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)

    if (valueConvertedToNumber < defaultMaxHeight) {
      setGeneralHeightValue(undefined)
      setInitialLayout(selectedLayoutId)
    }
  }

  const handleListInputBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const valueConvertedToNumber = Number.parseInt(e.target.value, 10)

    if (valueConvertedToNumber < defaultMaxHeight) {
      setListHeightValue(undefined)
      setInitialLayout(selectedLayoutId)
    }
  }

  if (selectedLayoutId === 'restricted-height') {
    return (
      <CardRowContainer sx={{ padding: 1 }}>
        <CardRowColumn>
          <label htmlFor={inputId1}>Set height</label>
          {(generalHeightValue && generalHeightValue < defaultMaxHeight) ||
          !generalHeightValue ? (
            <CapitalizeFirstLetter variant="caption">
              {`${defaultMaxHeight}px minimum`}
            </CapitalizeFirstLetter>
          ) : null}
        </CardRowColumn>
        <Input
          id={inputId1}
          type="number"
          value={generalHeightValue ?? ''}
          placeholder={`${defaultMaxHeight}`}
          onChange={handleHeightInputChange}
          onBlur={handleGeneralInputBlur}
        />
      </CardRowContainer>
    )
  }

  if (selectedLayoutId === 'restricted-max-height') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <CardRowContainer sx={{ padding: 1 }}>
          <CardRowColumn>
            <label htmlFor={inputId1}>General max height</label>
            {(generalHeightValue && generalHeightValue < defaultMaxHeight) ||
            !generalHeightValue ? (
              <CapitalizeFirstLetter variant="caption">
                {`${defaultMaxHeight}px minimum`}
              </CapitalizeFirstLetter>
            ) : null}
          </CardRowColumn>
          <Input
            id={inputId1}
            type="number"
            value={generalHeightValue ?? ''}
            placeholder={`${defaultMaxHeight}`}
            onChange={handleGeneralMaxHeightInputChange}
            onBlur={handleGeneralInputBlur}
          />
        </CardRowContainer>
        <CardRowContainer sx={{ padding: 1 }}>
          <CardRowColumn>
            <label htmlFor={inputId2}>List max height</label>
            {(listHeightValue && listHeightValue < defaultMaxHeight) ||
            !listHeightValue ? (
              <CapitalizeFirstLetter variant="caption">
                {`${defaultMaxHeight}px minimum`}
              </CapitalizeFirstLetter>
            ) : null}
          </CardRowColumn>
          <Input
            id={inputId2}
            type="number"
            value={listHeightValue ?? ''}
            placeholder={`${defaultMaxHeight}`}
            onChange={handleListMaxHeightInputChange}
            onBlur={handleListInputBlur}
          />
        </CardRowContainer>
      </div>
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
