import { defaultMaxHeight } from '@lifi/widget'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { type JSX, useCallback, useId, useState } from 'react'
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
}

export const HeightControl = ({
  selectedLayoutId,
}: HeightControlProps): JSX.Element | null => {
  const { container } = useConfigContainer()
  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()
  const heightInputId = useId()

  const field = getRestrictedLayoutField(selectedLayoutId)

  const [heightValue, setHeightValue] = useState<number | undefined>(() => {
    if (!field) {
      return undefined
    }
    const value = container?.[field.containerKey]
    return typeof value === 'number' &&
      Number.isFinite(value) &&
      value !== defaultMaxHeight
      ? value
      : undefined
  })

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
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
    [field, getCurrentConfigTheme, setContainer, setHeader]
  )

  const resetToDefault = useCallback((): void => {
    if (!field) {
      return
    }
    setHeightValue(undefined)
    setContainer({
      ...(getCurrentConfigTheme()?.container ?? {}),
      [field.containerKey]: defaultMaxHeight,
    })
  }, [field, getCurrentConfigTheme, setContainer])

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      const parsed = parseHeightInput(event.target.value)
      if (parsed === undefined || parsed < defaultMaxHeight) {
        resetToDefault()
      }
    },
    [resetToDefault]
  )

  if (!field) {
    return null
  }

  return (
    <HeightControlRoot>
      <HeightControlLabel htmlFor={heightInputId}>
        {field.label}
      </HeightControlLabel>
      <HeightControlRow>
        <HeightControlInput
          id={heightInputId}
          type="number"
          value={heightValue ?? ''}
          placeholder={`${defaultMaxHeight}`}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <ClearHeightButton
          size="small"
          onClick={resetToDefault}
          aria-label={field.clearLabel}
        >
          <CloseOutlinedIcon />
        </ClearHeightButton>
      </HeightControlRow>
      <HeightHelperText>Minimum {defaultMaxHeight}px</HeightHelperText>
    </HeightControlRoot>
  )
}
