import LineWeightOutlinedIcon from '@mui/icons-material/LineWeightOutlined'
import type { JSX } from 'react'
import { useCallback, useRef } from 'react'
import { useEditableDraft } from '../hooks/useEditableDraft.js'
import { ValueInput } from './Input.style.js'
import { ClickableRow, RowLabel, RowValue } from './Row.style.js'

interface BorderWeightRowProps {
  title: string
  value: number
  onChange: (w: number) => void
}

const toWeightDraft = (value: number): string => String(value)

export const BorderWeightRow = ({
  title,
  value,
  onChange,
}: BorderWeightRowProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)

  const parseDraft = useCallback((draft: string): number | null => {
    const n = Number.parseInt(draft, 10)
    if (Number.isFinite(n) && n >= 1 && n <= 4) {
      return n
    }
    return null
  }, [])

  const { draft, setDraft, commit } = useEditableDraft(
    value,
    toWeightDraft,
    parseDraft,
    onChange
  )

  const handleRowClick = useCallback(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <ClickableRow onClick={handleRowClick}>
      <RowLabel>Weight</RowLabel>
      <RowValue>
        <ValueInput
          inputRef={inputRef}
          value={draft}
          onChange={(e) => {
            const v = e.target.value
            setDraft(v)
            const n = Number.parseInt(v, 10)
            if (Number.isFinite(n) && n >= 1 && n <= 4) {
              onChange(n)
            }
          }}
          onFocus={(e) => (e.target as HTMLInputElement).select()}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              commit()
              ;(e.target as HTMLInputElement).blur()
            }
          }}
          inputProps={{
            'aria-label': `${title} border weight`,
            inputMode: 'numeric',
            style: { width: 20 },
          }}
        />
        <LineWeightOutlinedIcon sx={{ fontSize: 24, color: 'action.active' }} />
      </RowValue>
    </ClickableRow>
  )
}
