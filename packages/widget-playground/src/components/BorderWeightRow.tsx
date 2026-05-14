import LineWeightOutlinedIcon from '@mui/icons-material/LineWeightOutlined'
import type { JSX } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ValueInput } from './Input.style.js'
import { Row, RowLabel, RowValue } from './Row.style.js'

interface BorderWeightRowProps {
  title: string
  value: number
  onChange: (w: number) => void
}

export const BorderWeightRow = ({
  title,
  value,
  onChange,
}: BorderWeightRowProps): JSX.Element => {
  const [draft, setDraft] = useState(String(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = useCallback(() => {
    const n = Number.parseInt(draft, 10)
    if (Number.isFinite(n) && n >= 1 && n <= 4) {
      onChange(n)
      setDraft(String(n))
    } else {
      setDraft(String(value))
    }
  }, [draft, value, onChange])

  const handleRowClick = useCallback(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  return (
    <Row onClick={handleRowClick} sx={{ cursor: 'pointer' }}>
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
    </Row>
  )
}
