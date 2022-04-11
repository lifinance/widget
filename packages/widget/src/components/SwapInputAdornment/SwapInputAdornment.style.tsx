import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SwapPriceTypography = styled(Typography)(({ theme }) => ({
  borderLeft: '1px solid',
  borderColor: theme.palette.grey[300],
  paddingLeft: theme.spacing(1),
  marginLeft: theme.spacing(1),
}));

export const SwapMaxAmountTypography = styled(Typography)(({ theme }) => ({
  textDecoration: 'underline',
  padding: theme.spacing(0.5, 1, 0.5, 0),
  '&:hover': {
    cursor: 'pointer',
  },
}));
