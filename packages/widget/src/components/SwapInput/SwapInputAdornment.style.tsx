import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SwapMaxAmountTypography = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: '700',
  lineHeight: 1.3334,
  color: theme.palette.text.secondary,
  transition: theme.transitions.create(['color']),
  // padding: theme.spacing(0.5, 0),
  '&:hover': {
    cursor: 'pointer',
    color: theme.palette.text.primary,
  },
}));
