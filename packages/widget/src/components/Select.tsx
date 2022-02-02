import { Select as MuiSelect } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { alpha, styled } from '@mui/material/styles';

export const Select = styled(MuiSelect)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  borderRadius: 8,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow',
  ]),
  [`& .${inputBaseClasses.input}`]: {
    padding: '8.5px 14px',
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
  [`&.${inputBaseClasses.focused}`]: {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
}));
