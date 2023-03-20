import { Box, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { getContrastTextColor } from '../../utils';

export const CardLabel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type?: 'active' | 'insurance' | 'insurance-icon' }>(({ theme, type }) => ({
  backgroundColor:
    type === 'active'
      ? theme.palette.secondary.main
      : type?.includes('insurance')
      ? alpha(theme.palette.success.main, 0.12)
      : 'transparent',
  border: 'solid',
  borderWidth: type?.includes('insurance') ? 0 : 1,
  borderColor:
    type === 'active'
      ? theme.palette.secondary.main
      : theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  borderRadius: theme.shape.borderRadius,
  color:
    type === 'active'
      ? getContrastTextColor(theme, theme.palette.secondary.main)
      : type?.includes('insurance')
      ? theme.palette.success.main
      : theme.palette.text.secondary,
  padding: type === 'insurance' ? theme.spacing(0, 1.5) : 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 24,
  minWidth: 24,
  userSelect: 'none',
  fontSize: '1rem',
  marginRight: theme.spacing(1),
}));

export const CardLabelTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type?: 'icon' }>(({ theme, type }) => ({
  padding:
    type === 'icon'
      ? theme.spacing(0.75, 0, 0.75, 0.75)
      : theme.spacing(0.75, 1.5),
  fontSize: 12,
  lineHeight: 1,
  fontWeight: '600',
  textTransform: 'lowercase',
  '&::first-letter': {
    textTransform: 'uppercase',
  },
}));
