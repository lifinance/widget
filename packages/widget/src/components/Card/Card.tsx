import { Card as MuiCard } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Card = styled(MuiCard)(({ theme }) => ({
  borderRadius: 0,
  '&:hover': {
    cursor: 'pointer',
  },
}));
