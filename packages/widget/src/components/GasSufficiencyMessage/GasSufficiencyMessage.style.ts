import { Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const MessageCard = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.warning.main
      : alpha(theme.palette.warning.main, 0.42),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  display: 'flex',
  whiteSpace: 'pre-line',
}));
