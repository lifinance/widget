import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getContrastTextColor } from '../../utils';

export const Label = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  border: '1px solid',
  borderColor: active
    ? theme.palette.primary.main
    : theme.palette.mode === 'light'
    ? theme.palette.grey[500]
    : theme.palette.grey[600],
  borderRadius: theme.shape.borderRadiusSecondary,
  color: active
    ? getContrastTextColor(theme, theme.palette.primary.main)
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
