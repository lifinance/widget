import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SwapPriceTypography = styled(Typography)(({ theme }) => ({
  borderLeft: '1px solid',
  borderColor: theme.palette.grey[300],
  paddingLeft: theme.spacing(1),
  marginLeft: theme.spacing(1),
}));

export const SwapMaxAmountTypography = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  color: theme.palette.grey[600],
  transition: theme.transitions.create(['color']),
  padding: theme.spacing(0.5, 0),
  '&:hover': {
    cursor: 'pointer',
    color: theme.palette.text.primary,
  },
}));
