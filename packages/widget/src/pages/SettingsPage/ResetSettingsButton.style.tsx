import { Box, styled } from '@mui/material';
import { getContrastAlphaColor } from '../../utils/colors.js';

export const ResetButtonContainer = styled(Box)(({ theme }) => ({
  background: getContrastAlphaColor(theme, 0.04),
  borderRadius: '16px',
  padding: '16px',

  [`svg`]: {
    fill: getContrastAlphaColor(theme, 0.4),
  },
}));
