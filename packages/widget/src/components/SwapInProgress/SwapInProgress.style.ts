import { styled } from '@mui/material/styles';
import { CardContainer, CardHeader } from '../Card';

export const Card = styled(CardContainer)(({ theme }) => ({
  borderColor: theme.palette.mode === 'light' ? '#F7D4FF' : '#ee00ff47',
  background: theme.palette.mode === 'light' ? '#FEF0FF' : '#ee00ff47',
}));

export const RouteCard = styled(CardHeader)(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: 0,
  paddingBottom: 0,
}));
