import { InputBase } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';

export const Input = styled(InputBase)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  paddingRight: theme.spacing(2),
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(1.0625, 0, 1.0625, 2),
  },
  '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
    {
      WebkitAppearance: 'none',
      margin: 0,
    },
  '& input[type="number"]': {
    MozAppearance: 'textfield',
  },
  [`&.${inputBaseClasses.disabled}`]: {
    color: 'inherit',
  },
  [`& .${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
    WebkitTextFillColor: 'unset',
  },
}));
