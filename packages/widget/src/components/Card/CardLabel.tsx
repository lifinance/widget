import { Box, Typography } from '@mui/material';
import { alpha, lighten, styled } from '@mui/material/styles';

export const CardLabel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type?: 'active' | 'insurance' | 'insurance-icon' }>(({ theme, type }) => ({
  backgroundColor:
    type === 'active'
      ? theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : alpha(theme.palette.secondary.main, 0.32)
      : type?.includes('insurance')
      ? alpha(
          theme.palette.success.main,
          theme.palette.mode === 'light' ? 0.12 : 0.24,
        )
      : theme.palette.mode === 'light'
      ? alpha(theme.palette.common.black, 0.12)
      : alpha(theme.palette.common.white, 0.16),
  borderRadius: theme.shape.borderRadius,
  color: type?.includes('insurance')
    ? lighten(
        theme.palette.success.main,
        theme.palette.mode === 'light' ? 0 : 0.24,
      )
    : theme.palette.text.primary,
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
