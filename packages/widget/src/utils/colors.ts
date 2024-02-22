import type { PaletteMode, Theme } from '@mui/material';
import { alpha } from '@mui/material';

export const getContrastAlphaColor = (
  mode: PaletteMode,
  alpha: string | number,
) =>
  mode === 'light' ? `rgb(0 0 0 / ${alpha})` : `rgb(255 255 255 / ${alpha})`;

export const getWarningBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'light'
    ? alpha(theme.palette.warning.main, 0.32)
    : alpha(theme.palette.warning.main, 0.16);

export const getInfoBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'light'
    ? alpha(theme.palette.info.main, 0.12)
    : alpha(theme.palette.info.main, 0.16);

export const getCardFieldsetBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'light'
    ? alpha(theme.palette.common.black, 0.04)
    : theme.palette.grey[800];
