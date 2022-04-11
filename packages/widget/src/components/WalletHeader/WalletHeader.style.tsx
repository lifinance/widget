import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WalletTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'connected',
})<{ connected?: boolean }>(({ theme, connected }) => ({
  transition: theme.transitions.create(['color']),
  pointerEvents: connected ? 'auto' : 'none',
  '&:hover': {
    color: theme.palette.grey[700],
    cursor: 'pointer',
  },
}));
