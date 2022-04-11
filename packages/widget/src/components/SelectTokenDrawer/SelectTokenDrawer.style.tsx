import { Select as MuiSelect } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { listItemIconClasses } from '@mui/material/ListItemIcon';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';

export const TokenFilterSelect = styled(MuiSelect)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[900],
  borderRadius: theme.shape.borderRadius,
  border: 'none',
  '&:focus': {
    outline: 'none',
  },
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(0.5, 1.5),
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: 38,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
}));
