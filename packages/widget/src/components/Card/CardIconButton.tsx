import { IconButton as MuiIconButton, styled } from '@mui/material';
import { getContrastAlphaColor } from '../../utils/colors.js';

export const CardIconButton = styled(MuiIconButton)(({ theme }) => {
  return {
    padding: theme.spacing(0.5),
    backgroundColor: getContrastAlphaColor(theme, 0.04),
    '&:hover': {
      backgroundColor: getContrastAlphaColor(theme, 0.08),
    },
  };
});
