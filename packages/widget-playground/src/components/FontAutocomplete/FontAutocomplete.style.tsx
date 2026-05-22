import { Autocomplete as MuiAutocomplete, Popper, styled } from '@mui/material'
import { autocompleteClasses } from '@mui/material/Autocomplete'
import type React from 'react'
import type { FC } from 'react'
import { autocompletePopperZIndex } from '../../utils/sidebar.js'

export const StyledFontAutocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  borderRadius: 12,
  border: '1px solid',
  borderColor: theme.vars.palette.divider,
  backgroundColor: theme.vars.palette.background.paper,
  transition: 'border-color 0.15s',
  '&:hover': {
    borderColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 24%, transparent)`,
  },
  '&:focus-within': {
    borderColor: theme.vars.palette.primary.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  [`& .${autocompleteClasses.inputRoot}`]: {
    padding: theme.spacing(1.5),
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.secondary,
  },
  [`& .${autocompleteClasses.inputRoot} .${autocompleteClasses.input}`]: {
    padding: 0,
  },
  [`& .${autocompleteClasses.endAdornment}`]: {
    right: `${theme.spacing(1.5)} !important`,
    color: theme.vars.palette.text.secondary,
  },
})) as typeof MuiAutocomplete

export const FontPopper: FC<React.ComponentProps<typeof Popper>> = styled(
  Popper
)({
  [`&.${autocompleteClasses.popper}`]: {
    zIndex: autocompletePopperZIndex,
  },
  [`& .${autocompleteClasses.groupLabel}`]: {
    position: 'static',
  },
})
