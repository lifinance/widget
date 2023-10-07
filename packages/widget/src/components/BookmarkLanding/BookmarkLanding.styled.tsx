import {
  Container,
  InputBase,
  FormControl as MuiFormControl,
} from '@mui/material';
import Alert from '@mui/material/Alert';
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

export const PageContainer = styled(Container)(({ theme }) => ({
  height: 508,
  display: 'flex',
  flexDirection: 'column',
}));

export const AlertSection = styled(Alert)(({ theme }) => ({
  marginTop: 'auto',
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.text.primary,
  '.MuiAlert-icon': {
    color: theme.palette.grey[700],
  },
}));
