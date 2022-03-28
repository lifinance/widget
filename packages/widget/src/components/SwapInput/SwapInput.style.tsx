import { inputBaseClasses } from '@mui/material/InputBase';
import { styled } from '@mui/material/styles';
import { Input as InputBase } from '../Input';

export const Input = styled(InputBase)({
  borderRadius: '0 0 8px 8px',
  borderWidth: '1px 2px 2px 2px',
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
});
