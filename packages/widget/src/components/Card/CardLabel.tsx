import {
  Box,
  getContrastRatio,
  lighten,
  styled,
  Typography,
} from '@mui/material';
import { blend } from '../../utils/colors.js';

export const CardLabel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'type',
})<{ type?: 'active' | 'insurance' | 'insurance-icon' }>(({ theme, type }) => {
  const backgroundColor =
    type === 'active'
      ? theme.palette.mode === 'light'
        ? theme.palette.secondary.main
        : blend(
            theme.palette.background.paper,
            theme.palette.secondary.main,
            0.8,
          )
      : type?.includes('insurance')
        ? blend(
            theme.palette.background.paper,
            theme.palette.success.main,
            theme.palette.mode === 'light' ? 0.12 : 0.24,
          )
        : theme.palette.mode === 'light'
          ? blend(
              theme.palette.background.paper,
              theme.palette.common.black,
              0.12,
            )
          : blend(
              theme.palette.background.paper,
              theme.palette.common.white,
              0.16,
            );
  return {
    backgroundColor,
    borderRadius: theme.shape.borderRadius,
    color: type?.includes('insurance')
      ? lighten(
          theme.palette.success.main,
          theme.palette.mode === 'light' ? 0 : 0.24,
        )
      : getContrastRatio(theme.palette.common.white, backgroundColor) >= 3
        ? theme.palette.common.white
        : theme.palette.common.black,
    padding: type === 'insurance' ? theme.spacing(0, 1.5) : 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    minWidth: 24,
    userSelect: 'none',
    fontSize: '1rem',
    marginRight: theme.spacing(1),
  };
});

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
}));
