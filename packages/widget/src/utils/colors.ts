import { Theme } from '@mui/material';

export const getContrastAlphaColor = (theme: Theme, alpha: string | number) =>
  theme.palette.mode === 'light'
    ? `rgb(0 0 0 / ${alpha})`
    : `rgb(255 255 255 / ${alpha})`;
