import { Box } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useRef } from 'react'
import { useEditableDraft } from '../../hooks/useEditableDraft.js'
import {
  parseEditableHex,
  safe6DigitHexColor,
  stripHexPrefix,
} from '../../utils/color.js'
import { ValueInput } from '../Input.style.js'
import { ClickableRow, RowLabel, RowValue } from '../Row.style.js'
import { ColorSwatch, HexLabel } from './EditableColorRow.style.js'

interface EditableColorRowProps {
  label: React.ReactNode
  hex: string
  ariaLabel: string
  onChange: (hex: string) => void
}

const toHexDraft = (value: string): string => stripHexPrefix(value)

export const EditableColorRow = ({
  label,
  hex,
  ariaLabel,
  onChange,
}: EditableColorRowProps): JSX.Element => {
  const stripped = stripHexPrefix(hex)
  const resolvedHex = safe6DigitHexColor(`#${stripped}`)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const hexInputRef = useRef<HTMLInputElement>(null)

  const parseDraft = useCallback(
    (draft: string): string | null => parseEditableHex(draft),
    []
  )

  const { draft, setDraft, commit } = useEditableDraft(
    stripped,
    toHexDraft,
    parseDraft,
    onChange
  )

  const handleRowClick = (): void => {
    hexInputRef.current?.focus()
    hexInputRef.current?.select()
    colorInputRef.current?.click()
  }

  return (
    <ClickableRow onClick={handleRowClick}>
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
          swatchColor={resolvedHex}
          value={resolvedHex}
          onChange={(e) => onChange(e.target.value)}
        />
      </RowValue>
    </ClickableRow>
  )
}
