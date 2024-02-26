import { Box, Typography, alpha, styled } from '@mui/material';

export const IconTypography = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.32)
      : alpha(theme.palette.common.white, 0.4),
  lineHeight: 0,
}));

export const TokenContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 40,
}));
