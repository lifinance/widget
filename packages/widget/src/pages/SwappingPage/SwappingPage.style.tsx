import { Button as MuiButton, Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(1, 3, 3, 3),
}));

export const Button = styled(MuiButton)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.25, 2),
  fontSize: '1rem',
  marginTop: theme.spacing(2),
}));
