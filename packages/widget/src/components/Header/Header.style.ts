import { AppBar, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
  zIndex: 1250,
}));

export const HeaderToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'height',
})<{ height?: number }>(({ height }) => ({
  '@media all': {
    minHeight: height ?? 52,
  },
}));

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
