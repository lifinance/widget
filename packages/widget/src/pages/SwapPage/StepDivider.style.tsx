import { Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.grey[300],
}));
