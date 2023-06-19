import type { Theme } from '@mui/material';
import { Box } from '@mui/material';
import { alpha, darken, styled } from '@mui/material/styles';
import { RouteExecutionStatus } from '../../stores';

type StatusColor = RouteExecutionStatus | 'warning';

const getStatusColor = (status: StatusColor, theme: Theme) => {
  switch (status) {
    case RouteExecutionStatus.Done:
      return { color: theme.palette.success.main, alpha: 0.12, darken: 0 };
    case RouteExecutionStatus.Failed:
      return { color: theme.palette.error.main, alpha: 0.12, darken: 0 };
    case RouteExecutionStatus.Done | RouteExecutionStatus.Partial:
    case RouteExecutionStatus.Done | RouteExecutionStatus.Refunded:
    case 'warning':
      return {
        color: theme.palette.warning.main,
        alpha: 0.48,
        darken: theme.palette.mode === 'light' ? 0.32 : 0,
      };
    default:
      return { color: theme.palette.primary.main, alpha: 0.12, darken: 0 };
  }
};

export const CenterContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}));

export const IconCircle = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: StatusColor }>(({ theme, status }) => {
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
