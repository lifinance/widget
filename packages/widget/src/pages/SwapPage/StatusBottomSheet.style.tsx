import type { Theme } from '@mui/material';
import { Box } from '@mui/material';
import { alpha, darken, styled } from '@mui/material/styles';
import type { RouteExecutionStatus } from '../../stores';

const getStatusColor = (status: RouteExecutionStatus, theme: Theme) => {
  switch (status) {
    case 'success':
      return { color: theme.palette.success.main, alpha: 0.15, darken: 0 };
    case 'error':
      return { color: theme.palette.error.main, alpha: 0.2, darken: 0 };
    case 'warning':
      return { color: theme.palette.warning.main, alpha: 0.7, darken: 0.4 };
    default:
      return { color: theme.palette.primary.main, alpha: 0.15, darken: 0 };
  }
};

export const IconContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}));

export const IconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: RouteExecutionStatus }>(({ theme, status }) => {
  const {
    color,
    alpha: alphaValue,
    darken: darkenValue,
  } = getStatusColor(status, theme);
  return {
    backgroundColor: alpha(color, alphaValue),
    borderRadius: '50%',
    width: 64,
    height: 64,
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    '& > svg': {
      color: darken(color, darkenValue),
      width: 32,
      height: 32,
    },
  };
});
