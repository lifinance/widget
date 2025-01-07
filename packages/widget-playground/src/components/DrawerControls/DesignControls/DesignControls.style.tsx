import type {
  AutocompleteProps,
  BoxProps,
  InputBaseProps,
  Theme,
} from '@mui/material'
import {
  Box,
  ButtonBase,
  InputBase,
  Alert as MuiAlert,
  Autocomplete as MuiAutocomplete,
  Badge as MuiBadge,
  Select as MuiSelect,
  Popper,
  Typography,
  badgeClasses,
} from '@mui/material'
import { alertClasses } from '@mui/material/Alert'
import { autocompleteClasses } from '@mui/material/Autocomplete'
import { inputBaseClasses } from '@mui/material/InputBase'
import { alpha, styled } from '@mui/material/styles'
import { getCardFieldsetBackgroundColor } from '../../../utils/color'
import { CardRowContainer } from '../../Card/Card.style'
import { autocompletePopperZIndex } from '../DrawerControls.style'

export const TabButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary
  ),
  padding: theme.spacing(0.5),
  gap: theme.spacing(0.5),
  height: '3.5rem',
}))

const controlSelected = (theme: Theme) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : theme.palette.common.white,
  borderRadius: theme.shape.borderRadiusSecondary,
  boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
})

interface TabButtonProps {
  selected?: boolean
}
export const TabButton = styled(ButtonBase)<TabButtonProps>(
  ({ theme, selected }) => {
    const selectedStyle = selected
      ? {
          ...controlSelected(theme),
        }
      : {}

    return {
      height: '100%',
      width: '100%',
      fontSize: '1rem',
      fontWeight: 700,
      ...selectedStyle,
    }
  }
)

export const TabCustomInput = styled(InputBase)<TabButtonProps>(
  ({ theme, selected }) => {
    const selectedStyle = selected
      ? {
          '&:not(:focus)': {
            ...controlSelected(theme),
          },
        }
      : {}

    return {
      height: '100%',
      width: '100%',
      [`.${inputBaseClasses.input}`]: {
        height: '100%',
        width: '100%',
        padding: 0,
        textAlign: 'center',
        '&::placeholder': {
          fontSize: '1rem',
          fontWeight: 700,
          opacity: 1,
        },
        '&:focus': {
          ...controlSelected(theme),
        },
        ...selectedStyle,
      },
    }
  }
)

export const Input = styled(InputBase)(({ theme }) => {
  return {
    minHeight: 56,
    width: '100%',
    [`.${inputBaseClasses.input}`]: {
      minHeight: 56,
      width: '100%',
      padding: 0,
      textAlign: 'center',
      '&::placeholder': {
        fontSize: '1rem',
        fontWeight: 400,
        opacity: 0.5,
      },
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        display: 'none',
      },
    },
    backgroundColor: getCardFieldsetBackgroundColor(theme),
    borderRadius: theme.shape.borderRadiusSecondary,
    boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
  }
})

export const ColorSwatches = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-end',
  width: 240,
}))

interface ColorSwatchProps {
  color: string
}
export const ColorSwatch = styled(
  (props: BoxProps) => <Box {...props}>&nbsp;</Box>,
  {
    shouldForwardProp: (prop) => prop !== 'color',
  }
)<ColorSwatchProps>(({ theme, color }) => ({
  width: theme.spacing(1.75),
  height: theme.spacing(1.75),
  backgroundColor: color,
  content: '" "',
}))

export const ControlContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary
  ),
  padding: theme.spacing(0.5, 2.5),
  gap: theme.spacing(0.5),
  minHeight: theme.spacing(7),
}))

export const ColorControlContainer = styled(ControlContainer)(({ theme }) => ({
  height: theme.spacing(7),
  paddingRight: theme.spacing(0.5),
}))

export const PlaygroundControlsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}))

export const ControlRowContainer = styled(CardRowContainer)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
}))

export const ColorInput = styled(InputBase)<InputBaseProps>(
  ({ theme, value }) => ({
    position: 'relative',
    border: 'none',
    height: '100%',
    width: 97,
    padding: 0,
    backgroundColor: value as string,
    borderRadius:
      Math.max(theme.shape.borderRadius, theme.shape.borderRadiusSecondary) - 4,
    [`& .${inputBaseClasses.input}`]: {
      cursor: 'pointer',
    },
    [`& .${inputBaseClasses.input}::-webkit-color-swatch`]: {
      border: 'none',
    },
    [`& .${inputBaseClasses.input}::-moz-color-swatch`]: {
      border: 'none',
    },
    '&::after': {
      pointerEvents: 'none',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      content: `"${value}"`,
      fontSize: '1rem',
      fontWeight: 700,
      color: theme.palette.getContrastText(value as string),
      textTransform: 'none',
    },
  })
)

// NOTE: this is a workaround for type issues when styling the autocomplete
//  see - https://github.com/mui/material-ui/issues/21727
const AutocompleteBase: any = styled(MuiAutocomplete)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: theme.shape.borderRadiusSecondary,
  width: '100%',
  fontWeight: 700,
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  [`& .${autocompleteClasses.inputRoot}`]: {
    padding: theme.spacing(2, 3),
  },
  [`& .${autocompleteClasses.inputRoot} .${autocompleteClasses.input}`]: {
    padding: 0,
  },
  [`& .${autocompleteClasses.popper}`]: {
    zIndex: 1502,
  },
}))

export const Autocomplete = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(
  props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>
) => {
  return <AutocompleteBase {...props} />
}

export const StyledPopper = styled(Popper)({
  [`&.${autocompleteClasses.popper}`]: {
    zIndex: autocompletePopperZIndex,
  },
})

export const Alert = styled(MuiAlert)(({ theme }) => ({
  backgroundColor: 'transparent',
  fontSize: '0.9rem',
  color: theme.palette.grey[300],
  padding: 0,
  [`& .${alertClasses.icon}`]: {
    fontSize: '1.6rem',
    color: theme.palette.grey[300],
    ...theme.applyStyles('light', {
      color: theme.palette.grey[600],
    }),
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[600],
  }),
}))

export const Select = styled(MuiSelect)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: theme.shape.borderRadiusSecondary,
  width: '100%',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}))

export const CapitalizeFirstLetter = styled(Typography)(() => ({
  '&::first-letter': {
    textTransform: 'capitalize',
  },
}))

export const Badge = styled(MuiBadge)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.25),
  [`.${badgeClasses.badge}`]: {
    width: 10,
    height: 10,
    // the following removes MUI styling so we can position the badge with flex
    position: 'relative',
    transform: 'translateX(0)',
    borderRadius: '50%',
  },
}))
