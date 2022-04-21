import { Select as MuiSelect } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { listItemIconClasses } from '@mui/material/ListItemIcon';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { selectClasses } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

export const Select = styled(MuiSelect)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${selectClasses.icon}`]: {
    right: 10,
  },
  [`& .${listItemIconClasses.root}`]: {
    minWidth: 38,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
}));
