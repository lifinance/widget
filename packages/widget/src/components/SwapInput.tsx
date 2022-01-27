import { styled } from '@mui/material/styles';
import { Input } from './Input';

export const SwapInput = styled(Input)({
  borderRadius: '0 0 8px 8px',
  borderWidth: '1px 2px 2px 2px',
  '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type="number"]': {
    MozAppearance: 'textfield',
  },
});
