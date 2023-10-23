import {
  Alert,
  Container,
  InputBase,
  FormControl as MuiFormControl,
} from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const FormControl = styled(MuiFormControl)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 1.5, 0),
}));

export const Input = styled(InputBase)(({ theme }) => ({
  [`.${inputBaseClasses.input}`]: {
    height: 32,
    padding: theme.spacing(0, 0, 0, 2),
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
  },
  [`&.${inputBaseClasses.disabled}`]: {
    color: 'inherit',
  },
  [`.${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
    WebkitTextFillColor: 'unset',
  },
}));

export const AlertSection = styled(Alert)(({ theme }) => ({
  marginTop: 'auto',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  color: theme.palette.text.primary,
  '.MuiAlert-icon': {
    color:
      theme.palette.mode === 'light'
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
  },
  marginBottom: theme.spacing(2),
}));

export const PageContainer = styled(Container)(({ theme }) => ({
  height: 508,
  display: 'flex',
  flexDirection: 'column',
}));
