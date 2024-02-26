import { InputBase, inputBaseClasses, styled } from '@mui/material';

export const Input = styled(InputBase)(({ theme }) => ({
  paddingRight: theme.spacing(2),
  [`.${inputBaseClasses.input}`]: {
    padding: theme.spacing(1.5, 1, 1.5, 2),
    height: '2.875em',
    boxSizing: 'inherit',
  },
  fontWeight: 500,
}));
