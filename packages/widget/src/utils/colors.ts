import type { PaletteMode, Theme } from '@mui/material';
import { common } from '@mui/material/colors';
import { getContrastRatio } from '@mui/material/styles';

export const getContrastAlphaColor = (
  mode: PaletteMode,
  alpha: string | number,
) =>
  mode === 'light' ? `rgb(0 0 0 / ${alpha})` : `rgb(255 255 255 / ${alpha})`;

export const getContrastTextColor = (theme: Theme, background?: string) =>
  getContrastRatio(common.white, background ?? theme.palette.primary.main) >= 3
    ? common.white
    : common.black;
