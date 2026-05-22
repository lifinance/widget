import type { JSX } from 'react'
import { EditableSliderValue } from './EditableSliderValue/EditableSliderValue.js'
import {
  type SliderRow,
  ThemeSlider,
} from './EditableSliderValue/EditableSliderValue.style.js'
import { RowLabel, SubRow } from './Row.style.js'

interface SurfaceSliderRowProps {
  title: string
  label: string
  ariaSuffix: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  row?: typeof SliderRow | typeof SubRow
}

export const SurfaceSliderRow = ({
  title,
  label,
  ariaSuffix,
  value,
  min,
  max,
  onChange,
  row: RowComponent = SubRow,
}: SurfaceSliderRowProps): JSX.Element => {
  const ariaLabel = `${title} ${ariaSuffix}`

  return (
    <RowComponent>
      <RowLabel>{label}</RowLabel>
      <ThemeSlider
        size="small"
        value={value}
        min={min}
        max={max}
        onChange={(_, nextValue) => onChange(nextValue as number)}
        aria-label={ariaLabel}
      />
      <EditableSliderValue
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        ariaLabel={ariaLabel}
      />
    </RowComponent>
  )
}
