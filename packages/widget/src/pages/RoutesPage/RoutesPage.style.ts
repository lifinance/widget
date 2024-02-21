import { Stack as MuiStack, styled } from '@mui/material';

export const Stack = styled(MuiStack)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1, 3, 3, 3),
}));
