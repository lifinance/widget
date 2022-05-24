import { styled } from '@mui/material/styles';
import { CardContainer, CardHeader } from '../Card';

export const Card = styled(CardContainer)(({ theme }) => ({
  borderColor: '#F7D4FF',
  background: '#FEF0FF',
}));

export const RouteCard = styled(CardHeader)(({ theme }) => ({
  cursor: 'pointer',
  paddingTop: 0,
  paddingBottom: 0,
}));
