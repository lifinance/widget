import { InputBase } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const Input = styled(InputBase)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  paddingRight: theme.spacing(1.5),
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(1.375, 1.875, 1.375, 1.875),
    height: '1.5em',
  },
}));
