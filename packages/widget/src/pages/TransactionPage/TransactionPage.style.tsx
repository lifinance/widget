import { Container as MuiContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(1, 3),
}));
