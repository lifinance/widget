import { styled } from '@mui/material/styles';
import { Input as InputBase } from '../Input';

export const Input = styled(InputBase)({
  border: '1px solid #E4E7E9',
  borderRadius: '4px',
  '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
    {
      WebkitAppearance: 'none',
      margin: 0,
    },
  '& input[type="number"]': {
    MozAppearance: 'textfield',
  },
});
