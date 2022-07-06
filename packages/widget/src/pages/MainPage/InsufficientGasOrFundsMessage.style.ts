import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const MessageCard = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.warning.light
      : alpha(theme.palette.warning.dark, 0.69),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
}));
