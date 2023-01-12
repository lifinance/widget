import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const TextSecondaryContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'connected',
})<{ connected?: boolean }>(({ theme, connected }) => ({
  borderLeftWidth: connected ? 2 : 0,
  borderLeftStyle: 'solid',
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  margin: connected
    ? theme.spacing(0.5, 0, 0, 1.875)
    : theme.spacing(0, 0, 0, 6),
  padding: connected
    ? theme.spacing(0, 0, 0, 3.875)
    : theme.spacing(0, 0, 0, 0),
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
}));

export const TextSecondary = styled(Typography, {
  shouldForwardProp: (prop: string) => !['connected', 'dot'].includes(prop),
})<{ connected?: boolean; dot?: boolean }>(({ theme, connected, dot }) => ({
  fontSize: 12,
  lineHeight: 1,
  fontWeight: 500,
  color: dot
    ? alpha(theme.palette.text.secondary, 0.56)
    : theme.palette.text.secondary,
  marginTop: connected ? 0 : theme.spacing(0.5),
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
