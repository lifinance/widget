import { Box, Typography } from '@mui/material';
import { darken, styled } from '@mui/material/styles';

export const Card = styled(Box, {
  shouldForwardProp: (prop) =>
    !['dense', 'active', 'blur'].includes(prop as string),
})<{ active?: boolean; blur?: boolean; dense?: boolean }>(
  ({ theme, active, blur, dense }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    border: `1px solid ${
      active
        ? theme.palette.mode === 'light'
          ? theme.palette.common.black
          : theme.palette.grey[700]
        : theme.palette.mode === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[800]
    }`,
    borderRadius: dense
      ? theme.shape.borderRadiusSecondary
      : theme.shape.borderRadius,
    boxSizing: 'border-box',
    userSelect: blur ? 'none' : 'auto',
    '&:hover': {
      cursor: blur || !dense ? 'pointer' : 'default',
      backgroundColor:
        blur || !dense
          ? darken(theme.palette.background.paper, 0.02)
          : theme.palette.background.paper,
    },
    '& > div': {
      filter: blur ? 'blur(3px)' : 'none',
    },
    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
  }),
);

export const Label = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  border: '1px solid',
  borderColor: active
    ? theme.palette.primary.main
    : theme.palette.mode === 'light'
    ? theme.palette.common.black
    : theme.palette.grey[300],
  borderRadius: theme.shape.borderRadius / 2,
  color: active
    ? theme.palette.common.white
    : theme.palette.mode === 'light'
    ? theme.palette.common.black
    : theme.palette.grey[300],
  padding: theme.spacing(0.5, 0.75),
  fontSize: 12,
  lineHeight: 1.2,
  fontWeight: '600',
  height: 24,
  letterSpacing: '0.05rem',
  textTransform: 'uppercase',
  display: 'inline-flex',
  userSelect: 'none',
}));

export const Check = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  color: theme.palette.common.white,
  width: 24,
  height: 24,
  display: 'grid',
  placeItems: 'center',
  fontSize: '1rem',
}));
