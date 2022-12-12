import { FormControl as MuiFormControl, InputBase } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const FormControl = styled(MuiFormControl)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1.5, 0),
}));

export const Input = styled(InputBase)(({ theme }) => ({
  [`.${inputBaseClasses.input}`]: {
    height: 32,
    padding: theme.spacing(0, 0, 0, 2),
  },
  [`&.${inputBaseClasses.disabled}`]: {
    color: 'inherit',
  },
  [`.${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
    WebkitTextFillColor: 'unset',
  },
}));
