import {
  Select as MuiSelect,
  inputBaseClasses,
  listItemIconClasses,
  outlinedInputClasses,
  selectClasses,
  styled,
} from '@mui/material';

export const Select = styled(MuiSelect, {
  shouldForwardProp: (prop) => prop !== 'dense',
})<{ dense?: boolean }>(({ theme, dense }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.background.paper,
  [`.${inputBaseClasses.input}`]: {
    padding: dense ? theme.spacing(1.625, 2, 1.5, 2) : theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  [`.${selectClasses.icon}`]: {
    right: 10,
    color: theme.palette.text.primary,
  },
  [`.${listItemIconClasses.root}`]: {
    minWidth: 38,
  },
  [`.${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
}));
