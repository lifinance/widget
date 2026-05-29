import type { FC, JSX } from 'react'
import { memo, useCallback } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useConfigColor } from '../store/widgetConfig/useConfigValues.js'
import { safe6DigitHexColor } from '../utils/color.js'
import { EditableColorRow } from './EditableColorRow/EditableColorRow.js'

interface ThemeColorRowProps {
  label: string
  colorPath: string
}

export const ThemeColorRow: FC<ThemeColorRowProps> = memo(
  function ThemeColorRow({
    label,
    colorPath,
  }: ThemeColorRowProps): JSX.Element | null {
    const colorValue = useConfigColor(colorPath)
    const { setColor } = useConfigActions()

    const handleChange = useCallback(
      (newHex: string): void => {
        setColor(colorPath, newHex)
      },
      [colorPath, setColor]
    )

    if (!colorValue) {
      return null
    }

    const hex = safe6DigitHexColor(colorValue).toUpperCase()

    return (
      <EditableColorRow
        label={label}
        hex={hex}
        ariaLabel={label}
        onChange={handleChange}
      />
    )
  }
)
