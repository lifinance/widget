import type { JSX } from 'react'
import { useCallback } from 'react'
import { useEditableDraft } from '../../hooks/useEditableDraft.js'
import { SliderValueInput } from './EditableSliderValue.style.js'

interface EditableSliderValueProps {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  ariaLabel: string
}

const toNumericDraft = (value: number): string => String(value)

export const EditableSliderValue = ({
  value,
  min,
  max,
  onChange,
  ariaLabel,
}: EditableSliderValueProps): JSX.Element => {
  const parseDraft = useCallback(
    (draft: string): number | null => {
      const n = Number.parseInt(draft, 10)
      if (Number.isFinite(n)) {
        return Math.max(min, Math.min(max, n))
      }
      return null
    },
    [min, max]
  )

  const { draft, setDraft, commit } = useEditableDraft(
    value,
    toNumericDraft,
    parseDraft,
    onChange
  )

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
