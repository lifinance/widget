import { LoadingButton, loadingButtonClasses } from '@mui/lab';
import { styled } from '@mui/material';
import { getContrastAlphaColor } from '../utils/colors.js';

export const ButtonTertiary = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  height: 40,
  fontSize: 14,
  backgroundColor: getContrastAlphaColor(theme, 0.04),
  '&:hover, &:active': {
    backgroundColor: getContrastAlphaColor(theme, 0.08),
  },
  [`&.${loadingButtonClasses.loading}:disabled`]: {
    backgroundColor: getContrastAlphaColor(theme, 0.04),
  },
  [`.${loadingButtonClasses.loadingIndicator}`]: {
    color: theme.palette.text.primary,
  },
}));
