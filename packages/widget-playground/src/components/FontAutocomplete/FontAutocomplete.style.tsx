import { Autocomplete as MuiAutocomplete, Popper, styled } from '@mui/material'
import { autocompleteClasses } from '@mui/material/Autocomplete'
import { autocompletePopperZIndex } from '../Sidebar/DrawerControls.style.js'

export const StyledFontAutocomplete = styled(MuiAutocomplete)(({ theme }) => ({
  borderRadius: 12,
  border: '1px solid',
  borderColor: theme.vars.palette.divider,
  backgroundColor: theme.vars.palette.background.paper,
  transition: 'border-color 0.15s',
  '&:hover': {
    borderColor: 'rgba(0,0,0,0.24)',
    ...theme.applyStyles('dark', {
      borderColor: 'rgba(255,255,255,0.24)',
    }),
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

export const FontPopper: React.FC<React.ComponentProps<typeof Popper>> = styled(
  Popper
)({
  [`&.${autocompleteClasses.popper}`]: {
    zIndex: autocompletePopperZIndex,
  },
  [`& .${autocompleteClasses.groupLabel}`]: {
    position: 'static',
  },
})
