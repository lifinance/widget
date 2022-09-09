import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Card } from '../../components/Card';

export const ChainCard = styled(Card)({
  display: 'grid',
  placeItems: 'center',
  minWidth: 56,
  height: 56,
});

export const ChainContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(56px, 1fr))',
  gridAutoRows: '56px',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
}));
