import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TextSecondary = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'connected',
})<{ connected?: boolean }>(({ theme, connected }) => ({
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 500,
  color: theme.palette.text.secondary,
  borderLeftWidth: connected ? 2 : 0,
  borderLeftStyle: 'solid',
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  margin: connected
    ? theme.spacing(0.5, 0, 0, 1.875)
    : theme.spacing(0.5, 0, 0, 6),
  padding: connected
    ? theme.spacing(0, 0, 0, 3.875)
    : theme.spacing(0, 0, 0, 0),
}));

export const TokenDivider = styled(Box)(({ theme }) => ({
  height: 12,
  borderLeftWidth: 2,
  borderLeftStyle: 'solid',
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  margin: theme.spacing(0, 0, 0, 3.875),
  padding: theme.spacing(0, 0, 0, 3.875),
}));
