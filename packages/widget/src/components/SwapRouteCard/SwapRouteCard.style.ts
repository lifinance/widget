import { IconButton as MuiIconButton, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { getContrastTextColor } from '../../utils';

export const Label = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.secondary.main : 'transparent',
  border: '1px solid',
  borderColor: active
    ? theme.palette.secondary.main
    : theme.palette.mode === 'light'
    ? theme.palette.grey[300]
    : theme.palette.grey[800],
  borderRadius: theme.shape.borderRadiusSecondary,
  color: active
    ? getContrastTextColor(theme, theme.palette.secondary.main)
    : theme.palette.text.secondary,
  padding: theme.spacing(0.75),
  fontSize: 12,
  lineHeight: 1,
  fontWeight: '600',
  height: 24,
  letterSpacing: '0.05rem',
  textTransform: 'uppercase',
  display: 'inline-flex',
  userSelect: 'none',
}));

export const IconButton = styled(MuiIconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.common.black
      : theme.palette.common.white;
  return {
    backgroundColor: alpha(backgroundColor, 0.04),
    '&:hover': {
      backgroundColor: alpha(backgroundColor, 0.08),
    },
  };
});
