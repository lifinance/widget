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
  borderRadius: 8,
  border: 'none',
  '&:focus': {
    outline: 'none',
  },
  [`& .${inputBaseClasses.input}`]: {
    padding: '4px 12px',
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
