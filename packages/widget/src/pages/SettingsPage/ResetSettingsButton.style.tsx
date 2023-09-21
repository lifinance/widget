import { getContrastAlphaColor } from '../../utils';
import { Box, styled } from '@mui/material';

export const ResetButtonContainer = styled(Box)(({ theme }) => ({
  background: getContrastAlphaColor(theme.palette.mode, '4%'),
  borderRadius: '16px',
  padding: '16px',

  [`svg`]: {
    fill: getContrastAlphaColor(theme.palette.mode, '40%'),
  },
}));
