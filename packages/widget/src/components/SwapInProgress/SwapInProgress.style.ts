import { alpha, styled } from '@mui/material/styles';
import { CardContainer, CardHeader } from '../Card';

export const Card = styled(CardContainer)(({ theme }) => ({
  borderColor: alpha(theme.palette.secondary.main, 0.48),
  background: alpha(theme.palette.secondary.main, 0.2),
}));

export const RouteCard = styled(CardHeader)(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: 0,
  paddingBottom: 0,
}));
