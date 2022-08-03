import { Theme } from '@mui/material';
import { getContrastRatio } from '@mui/material/styles';
import { dark, light } from '@mui/material/styles/createPalette';

export const getContrastAlphaColor = (theme: Theme, alpha: string | number) =>
  theme.palette.mode === 'light'
    ? `rgb(0 0 0 / ${alpha})`
    : `rgb(255 255 255 / ${alpha})`;

export const getContrastTextColor = (theme: Theme, background?: string) =>
  getContrastRatio(
    dark.text.primary,
    background ?? theme.palette.primary.main,
  ) >= 3
    ? dark.text.primary
    : light.text.primary;
