import { Container as MuiContainer, styled } from '@mui/material';

export const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: theme.spacing(2),
}));
