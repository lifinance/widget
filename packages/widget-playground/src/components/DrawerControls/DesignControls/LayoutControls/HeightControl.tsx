import { defaultMaxHeight } from '@lifi/widget'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { Box, IconButton } from '@mui/material'
import { inputBaseClasses } from '@mui/material/InputBase'
import { type FocusEventHandler, type JSX, useCallback, useId } from 'react'
import type { Layout } from '../../../../store/editTools/types.js'
import { useConfigActions } from '../../../../store/widgetConfig/useConfigActions.js'
import { Input } from '../DesignControls.style.js'

export const HeightControl = ({
  selectedLayoutId,
  setInitialLayout,
  heightValue,
  setHeightValue,
  onClearMaxHeight,
}: {
  selectedLayoutId: Layout
  setInitialLayout: (layoutId: Layout) => void
  heightValue: number | undefined
  setHeightValue: (height: number | undefined) => void
  onClearMaxHeight?: () => void
}): JSX.Element | null => {
  const { setHeader, setContainer, getCurrentConfigTheme } = useConfigActions()
  const maxHeightInputId = useId()

  const handleHeightChange = useCallback(
    (key: 'height' | 'maxHeight') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number.parseInt(e.target.value, 10)
        const parsed = Number.isFinite(val) ? val : undefined

        setHeightValue(parsed)

        if (getCurrentConfigTheme()?.header) {
          setHeader()
        }

        if (parsed && parsed >= defaultMaxHeight) {
          setContainer({
            ...(getCurrentConfigTheme()?.container ?? {}),
            [key]: parsed,
          })
        }
      },
    [setHeightValue, getCurrentConfigTheme, setContainer, setHeader]
  )

  const handleBlur: FocusEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const val = Number.parseInt(e.target.value, 10)
      if (!Number.isFinite(val) || val < defaultMaxHeight) {
        setHeightValue(undefined)
        setInitialLayout(selectedLayoutId)
      }
    },
    [selectedLayoutId, setHeightValue, setInitialLayout]
  )

  if (
    selectedLayoutId === 'restricted-height' ||
    selectedLayoutId === 'restricted-max-height'
  ) {
    const isMaxHeight = selectedLayoutId === 'restricted-max-height'
    const label = isMaxHeight ? 'Add max height' : 'Set height'
    const key = isMaxHeight ? 'maxHeight' : 'height'

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width: '100%',
        }}
      >
        <Box
          component="label"
          htmlFor={maxHeightInputId}
          sx={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '18px',
          }}
        >
          {label}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: '100%',
          }}
        >
          <Input
            id={maxHeightInputId}
            type="number"
            value={heightValue}
            placeholder={`${defaultMaxHeight}`}
            onChange={handleHeightChange(key)}
            onBlur={handleBlur}
            sx={(theme) => ({
              minHeight: 44,
              backgroundColor: theme.vars.palette.background.default,
              border: '1px solid',
              borderColor: theme.vars.palette.divider,
              borderRadius: '12px',
              boxShadow: 'none',
              [`.${inputBaseClasses.input}`]: {
                minHeight: 'auto',
                textAlign: 'left',
                padding: theme.spacing(1.5),
                fontSize: 16,
                fontWeight: 500,
                lineHeight: '20px',
                '&::placeholder': {
                  opacity: 1,
                  color: theme.vars.palette.text.secondary,
                },
              },
            })}
          />
          {onClearMaxHeight ? (
            <IconButton
              size="small"
              onClick={onClearMaxHeight}
              aria-label="Clear max height"
              sx={{ p: 0, flexShrink: 0 }}
            >
              <CloseOutlinedIcon />
            </IconButton>
          ) : null}
        </Box>
      </Box>
    )
  }

  return null
}
