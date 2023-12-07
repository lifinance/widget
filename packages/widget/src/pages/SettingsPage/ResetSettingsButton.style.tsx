import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils';

export const ResetButtonContainer = styled(Box)(({ theme }) => ({
  background: getContrastAlphaColor(theme.palette.mode, '4%'),
  borderRadius: '16px',
  padding: '16px',

  [`svg`]: {
    fill: getContrastAlphaColor(theme.palette.mode, '40%'),
  },
}));
