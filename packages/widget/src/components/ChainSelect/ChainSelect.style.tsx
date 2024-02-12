import { Box, styled } from '@mui/material';
import { Card } from '../../components/Card/Card.js';

export const ChainCard = styled(Card)({
  display: 'grid',
  placeItems: 'center',
  minWidth: 52,
  height: 56,
});

export const ChainContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(52px, 1fr))',
  gridAutoRows: '56px',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}));
