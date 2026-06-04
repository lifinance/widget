import { defaultMaxHeight } from '@lifi/widget'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import {
  type JSX,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import type { Layout } from '../../store/editTools/types.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useConfigContainer } from '../../store/widgetConfig/useConfigValues.js'
import {
  getRestrictedLayoutField,
  parseHeightInput,
} from '../../utils/layout.js'
import {
  ClearHeightButton,
  HeightControlInput,
  HeightControlLabel,
  HeightControlRoot,
  HeightControlRow,
  HeightHelperText,
} from './HeightControl.style.js'

interface HeightControlProps {
  selectedLayoutId: Layout
  setInitialLayout: (layoutId: Layout) => void
}

export const HeightControl = ({
  selectedLayoutId,
  setInitialLayout,
}: HeightControlProps): JSX.Element | null => {
  const { container } = useConfigContainer()
  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()
  const heightInputId = useId()

  const containerHeightValue = useMemo(() => {
    const field = getRestrictedLayoutField(selectedLayoutId)
    if (!field) {
      return undefined
    }
    const value = container?.[field.containerKey]
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : undefined
  }, [container, selectedLayoutId])

  const [heightValue, setHeightValue] = useState<number | undefined>(
    containerHeightValue
  )

  useEffect(() => {
    setHeightValue(containerHeightValue)
  }, [containerHeightValue])

  const handleHeightChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const field = getRestrictedLayoutField(selectedLayoutId)
      if (!field) {
        return
      }

      const parsed = parseHeightInput(event.target.value)
      setHeightValue(parsed)

      const currentTheme = getCurrentConfigTheme()
      if (currentTheme?.header) {
        setHeader()
      }

      if (parsed && parsed >= defaultMaxHeight) {
        setContainer({
          ...(currentTheme?.container ?? {}),
          [field.containerKey]: parsed,
        })
      }
    },
    [selectedLayoutId, getCurrentConfigTheme, setContainer, setHeader]
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      const parsed = parseHeightInput(event.target.value)
      if (parsed === undefined || parsed < defaultMaxHeight) {
        setHeightValue(undefined)
        setInitialLayout(selectedLayoutId)
      }
    },
    [selectedLayoutId, setInitialLayout]
  )

  const handleClear = useCallback((): void => {
    setHeightValue(undefined)
    setInitialLayout(selectedLayoutId)
  }, [selectedLayoutId, setInitialLayout])

  const layoutField = getRestrictedLayoutField(selectedLayoutId)
  if (!layoutField) {
    return null
  }

  return (
    <HeightControlRoot>
      <HeightControlLabel htmlFor={heightInputId}>
        {layoutField.label}
      </HeightControlLabel>
      <HeightControlRow>
        <HeightControlInput
          id={heightInputId}
          type="number"
          value={heightValue ?? ''}
          placeholder={`${defaultMaxHeight}`}
          onChange={handleHeightChange}
          onBlur={handleBlur}
        />
        <ClearHeightButton
          size="small"
          onClick={handleClear}
          aria-label={layoutField.clearLabel}
        >
          <CloseOutlinedIcon />
        </ClearHeightButton>
      </HeightControlRow>
      <HeightHelperText>Minimum {defaultMaxHeight}px</HeightHelperText>
    </HeightControlRoot>
  )
}
