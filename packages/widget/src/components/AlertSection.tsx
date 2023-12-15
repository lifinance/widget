import { styled } from '@mui/material/styles';
import { Alert } from '@mui/material';

export const AlertSection = styled(Alert)(({ theme, severity }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    severity === 'info'
      ? theme.palette.mode === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800]
      : 'transparent',
  color: theme.palette.text.primary,
  '.MuiAlert-icon': {
    color:
      severity === 'error'
        ? theme.palette.mode === 'light'
          ? theme.palette.error.light
          : theme.palette.error.dark
        : theme.palette.mode === 'light'
          ? theme.palette.grey[700]
          : theme.palette.grey[300],
  },
}));
