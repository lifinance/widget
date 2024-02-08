import type { Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

export const getCardFieldsetBackgroundColor = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? theme.palette.grey[800]
    : alpha(theme.palette.common.black, 0.04);
