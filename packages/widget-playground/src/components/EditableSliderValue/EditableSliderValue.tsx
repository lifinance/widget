import type { JSX } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { SliderValueInput } from './EditableSliderValue.style.js'

interface EditableSliderValueProps {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  ariaLabel: string
}

export const EditableSliderValue = ({
  value,
  min,
  max,
  onChange,
  ariaLabel,
}: EditableSliderValueProps): JSX.Element => {
  const [draft, setDraft] = useState(String(value))

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = useCallback(() => {
    const n = Number.parseInt(draft, 10)
    if (Number.isFinite(n)) {
      const clamped = Math.max(min, Math.min(max, n))
      onChange(clamped)
      setDraft(String(clamped))
    } else {
      setDraft(String(value))
    }
  }, [draft, value, min, max, onChange])

  return (
    <SliderValueInput
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => (e.target as HTMLInputElement).select()}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          commit()
          ;(e.target as HTMLInputElement).blur()
        }
      }}
      inputProps={{
        'aria-label': ariaLabel,
        inputMode: 'numeric',
      }}
    />
  )
}
