import { Box, styled } from '@mui/material';
import { Card } from '../../components/Card/Card.js';

export const MobileChainCard = styled(Card)({
  display: 'grid',
  placeItems: 'center',
  minWidth: 40,
  height: 52,
});

export const MobileChainContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(47px, 1fr))',
  gridAutoRows: '52px',
  justifyContent: 'space-between',
  gap: theme.spacing(0.75),
}));
