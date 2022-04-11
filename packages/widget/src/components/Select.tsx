import { Select as MuiSelect } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { listItemIconClasses } from '@mui/material/ListItemIcon';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { alpha, styled } from '@mui/material/styles';

export const Select = styled(MuiSelect)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  borderRadius: theme.shape.borderRadius,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow',
  ]),
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(1.0625, 1.75),
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: 38,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
  [`&.${inputBaseClasses.focused}`]: {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
}));

export const MultiSelect = styled(Select)(({ theme }) => ({
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(0.5, 1.75),
  },
}));
