import { InputBase } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const Input = styled(InputBase)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.background.paper,
  paddingRight: theme.spacing(2),
  [`.${inputBaseClasses.input}`]: {
    padding: theme.spacing(1.5, 1, 1.5, 2),
    height: '2.875em',
    boxSizing: 'inherit',
  },
}));
