import { TextField } from '@mui/material'
import type { JSX } from 'react'
import { useFontSelection } from '../../hooks/useFontSelection.js'
import {
  getFontAutocompleteOptionLabel,
  groupFontBySource,
  isFontAutocompleteOptionEqual,
  sortedFonts,
} from '../../utils/font.js'
import { FontPopper, StyledFontAutocomplete } from './FontAutocomplete.style.js'

export const FontAutocomplete = (): JSX.Element | null => {
  const { selectedFont, handleFontChange, handleFontBlur } = useFontSelection()

  if (!selectedFont) {
    return null
  }

  return (
    <StyledFontAutocomplete
      freeSolo
      slots={{ popper: FontPopper }}
      options={sortedFonts}
      groupBy={groupFontBySource}
      getOptionLabel={getFontAutocompleteOptionLabel}
      value={selectedFont}
      isOptionEqualToValue={isFontAutocompleteOptionEqual}
      onChange={handleFontChange}
      onBlur={handleFontBlur}
      renderInput={(params) => (
        <TextField {...params} aria-label="font selection" />
      )}
    />
  )
}
