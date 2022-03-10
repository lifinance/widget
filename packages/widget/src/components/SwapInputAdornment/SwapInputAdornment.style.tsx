import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const SwapPriceTypography = styled(Typography)(({ theme }) => ({
  borderLeft: '1px solid',
  borderColor: theme.palette.grey[300],
  paddingLeft: 8,
  marginLeft: 8,
}));

export const SwapMaxAmountTypography = styled(Typography)({
  textDecoration: 'underline',
  padding: '4px 8px 4px 0',
  '&:hover': {
    cursor: 'pointer',
  },
});
