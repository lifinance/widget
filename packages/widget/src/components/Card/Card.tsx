import { Box } from '@mui/material';
import { darken, lighten, styled } from '@mui/material/styles';
import { MouseEventHandler } from 'react';

export const Card = styled(Box, {
  shouldForwardProp: (prop) =>
    !['dense', 'variant', 'indented'].includes(prop as string),
})<{
  variant?: 'default' | 'error';
  dense?: boolean;
  indented?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}>(({ theme, variant, dense, indented, onClick }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid`,
  borderColor:
    variant === 'error'
      ? theme.palette.error.main
      : theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  borderRadius: dense
    ? theme.shape.borderRadiusSecondary
    : theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  padding: indented ? theme.spacing(2) : 0,
  boxSizing: 'border-box',
  '&:hover': {
    cursor: onClick ? 'pointer' : 'default',
    backgroundColor: onClick
      ? theme.palette.mode === 'light'
        ? darken(theme.palette.background.paper, 0.02)
        : lighten(theme.palette.background.paper, 0.02)
      : theme.palette.background.paper,
  },
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.easeOut,
  }),
}));
