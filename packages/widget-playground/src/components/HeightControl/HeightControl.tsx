import { defaultMaxHeight } from '@lifi/widget'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { type JSX, useCallback, useId } from 'react'
import type { Layout } from '../../store/editTools/types.js'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
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
  heightValue: number | undefined
  setHeightValue: (height: number | undefined) => void
  onClearMaxHeight?: () => void
}

export const HeightControl = ({
  selectedLayoutId,
  setInitialLayout,
  heightValue,
  setHeightValue,
  onClearMaxHeight,
}: HeightControlProps): JSX.Element | null => {
  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()
  const heightInputId = useId()

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
    [
      selectedLayoutId,
      setHeightValue,
      getCurrentConfigTheme,
      setContainer,
      setHeader,
    ]
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>): void => {
      const parsed = parseHeightInput(event.target.value)
      if (parsed === undefined || parsed < defaultMaxHeight) {
        setHeightValue(undefined)
        setInitialLayout(selectedLayoutId)
      }
    },
    [selectedLayoutId, setHeightValue, setInitialLayout]
  )

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
        {onClearMaxHeight ? (
          <ClearHeightButton
            size="small"
            onClick={onClearMaxHeight}
            aria-label={layoutField.clearLabel}
          >
            <CloseOutlinedIcon />
          </ClearHeightButton>
        ) : null}
      </HeightControlRow>
      <HeightHelperText>Minimum {defaultMaxHeight}px</HeightHelperText>
    </HeightControlRoot>
  )
}
