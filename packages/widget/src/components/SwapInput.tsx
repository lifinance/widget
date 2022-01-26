import { InputBase } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';

export const SwapInput = styled(InputBase)(({ theme }) => ({
  borderRadius: '0 0 8px 8px',
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.common.white : theme.palette.grey[900],
  borderWidth: '1px 2px 2px 2px',
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  paddingRight: '14px',
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow',
  ]),
  [`& .${inputBaseClasses.input}`]: {
    padding: '8.5px 0 8.5px 14px',
  },
  [`&.${inputBaseClasses.focused}`]: {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
  '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: 0,
  },
  '& input[type="number"]': {
    MozAppearance: 'textfield',
  },
}));
