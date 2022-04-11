import { InputBase } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';

export const Input = styled(InputBase)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.common.white
      : theme.palette.grey[900],
  borderRadius: theme.shape.borderRadius,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  paddingRight: theme.spacing(1.75),
  transition: theme.transitions.create([
    'border-color',
    'background-color',
    'box-shadow',
  ]),
  [`& .${inputBaseClasses.input}`]: {
    padding: theme.spacing(1.0625, 0, 1.0625, 1.75),
  },
  [`&.${inputBaseClasses.focused}`]: {
    boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
    borderColor: theme.palette.primary.main,
  },
}));
