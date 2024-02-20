import { alpha, styled } from '@mui/material/styles';
import { inputBaseClasses } from '@mui/material/InputBase';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { alertClasses } from '@mui/material/Alert';
import type {
  BoxProps,
  InputBaseProps,
  Theme,
  AutocompleteProps,
} from '@mui/material';
import {
  Box,
  ButtonBase,
  InputBase,
  Autocomplete as MuiAutocomplete,
  Popper,
  Alert as MuiAlert,
} from '@mui/material';
import { getCardFieldsetBackgroundColor } from '../../../utils';
import { autocompletePopperZIndex } from '../DrawerControls.style';

export const TabButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary,
  ),
  padding: theme.spacing(0.5),
  gap: theme.spacing(0.5),
  height: '3.5rem',
}));

const controlSelected = (theme: Theme) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : theme.palette.common.white,
  borderRadius: theme.shape.borderRadiusSecondary,
  boxShadow: `0px 2px 4px ${alpha(theme.palette.common.black, 0.04)}`,
});

interface TabButtonProps {
  selected?: boolean;
}
export const TabButton = styled(ButtonBase)<TabButtonProps>(({
  theme,
  selected,
}) => {
  const selectedStyle = selected
    ? {
        ...controlSelected(theme),
      }
    : {};

  return {
    height: '100%',
    width: '100%',
    fontSize: '1rem',
    fontWeight: 700,
    ...selectedStyle,
  };
});

export const TabCustomInput = styled(InputBase)<TabButtonProps>(({
  theme,
  selected,
}) => {
  const selectedStyle = selected
    ? {
        '&:not(:focus)': {
          ...controlSelected(theme),
        },
      }
    : {};

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
  };
});

export const ColorSwatches = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

interface ColorSwatchProps {
  color: string;
}
export const ColorSwatch = styled(
  (props: BoxProps) => <Box {...props}>&nbsp;</Box>,
  {
    shouldForwardProp: (prop) => prop !== 'color',
  },
)<ColorSwatchProps>(({ theme, color }) => ({
  width: theme.spacing(3),
  height: 'auto',
  backgroundColor: color,
  content: '" "',
}));

export const ColorSelectorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: Math.max(
    theme.shape.borderRadius,
    theme.shape.borderRadiusSecondary,
  ),
  padding: theme.spacing(0.5),
  paddingLeft: theme.spacing(2.5),
  gap: theme.spacing(0.5),
  height: '3.5rem',
  textTransform: 'capitalize',
}));

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
  }),
);

// NOTE: this is a workaround for type issues when styling the autocomplete
//  see - https://github.com/mui/material-ui/issues/21727
const AutocompleteBase: any = styled(MuiAutocomplete)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  backgroundColor: getCardFieldsetBackgroundColor(theme),
  borderRadius: theme.shape.borderRadiusSecondary,
  width: '100%',
  fontWeight: 700,
  [`& .MuiOutlinedInput-notchedOutline`]: {
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
}));

export const Autocomplete = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(
  props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
) => {
  return <AutocompleteBase {...props} />;
};

export const StyledPopper = styled(Popper)({
  [`&.${autocompleteClasses.popper}`]: {
    zIndex: autocompletePopperZIndex,
  },
});

export const Alert = styled(MuiAlert)(({ theme }) => ({
  backgroundColor: 'transparent',
  fontSize: `0.9rem`,
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[600]
      : theme.palette.grey[300],
  padding: 0,
  [`& .${alertClasses.icon}`]: {
    fontSize: `1.6rem`,
    color:
      theme.palette.mode === 'light'
        ? theme.palette.grey[600]
        : theme.palette.grey[300],
  },
}));
