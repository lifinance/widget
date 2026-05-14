import { Box } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { safe6DigitHexColor } from '../../utils/color.js'
import { ValueInput } from '../Input.style.js'
import { Row, RowLabel, RowValue } from '../Row.style.js'
import { ColorSwatch, HexLabel } from './EditableColorRow.style.js'

interface EditableColorRowProps {
  label: React.ReactNode
  hex: string
  ariaLabel: string
  onChange: (hex: string) => void
}

export const EditableColorRow = ({
  label,
  hex,
  ariaLabel,
  onChange,
}: EditableColorRowProps): JSX.Element => {
  const stripped = hex.replace(/^#/, '').toUpperCase()
  const [draft, setDraft] = useState(stripped)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const hexInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(hex.replace(/^#/, '').toUpperCase())
  }, [hex])

  const commit = useCallback(() => {
    const cleaned = draft.replace(/[^0-9a-fA-F]/g, '')
    if (cleaned.length === 6 || cleaned.length === 3) {
      const full = safe6DigitHexColor(`#${cleaned}`)
      onChange(full)
      setDraft(full.replace(/^#/, '').toUpperCase())
    } else {
      setDraft(stripped)
    }
  }, [draft, stripped, onChange])

  const handleRowClick = useCallback(() => {
    hexInputRef.current?.focus()
    hexInputRef.current?.select()
    colorInputRef.current?.click()
  }, [])

  return (
    <Row onClick={handleRowClick} sx={{ cursor: 'pointer' }}>
      <RowLabel>{label}</RowLabel>
      <RowValue>
        <Box
          sx={{ display: 'flex', alignItems: 'center' }}
          onClick={(e) => e.stopPropagation()}
        >
          <HexLabel>#</HexLabel>
          <ValueInput
            inputRef={hexInputRef}
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
              style: { width: 56 },
            }}
          />
        </Box>
        <ColorSwatch
          inputRef={colorInputRef}
          aria-label={`${ariaLabel} picker`}
          type="color"
          swatchColor={safe6DigitHexColor(`#${stripped}`)}
          value={safe6DigitHexColor(`#${stripped}`)}
          onChange={(e) => onChange(e.target.value)}
        />
      </RowValue>
    </Row>
  )
}
