import { Status } from '@lifinance/sdk';
import { CircularProgress as MuiCircularProgress, Theme } from '@mui/material';
import { circularProgressClasses } from '@mui/material/CircularProgress';
import { keyframes, styled } from '@mui/material/styles';

const circleAnimation = keyframes({
  '0%': {
    strokeDashoffset: 129,
    transform: 'rotate(0)',
  },
  '50%': {
    strokeDashoffset: 56,
    transform: 'rotate(45deg)',
  },
  '100%': {
    strokeDashoffset: 129,
    transform: 'rotate(360deg)',
  },
});

const getStatusColor = (status: Status, theme: Theme) => {
  switch (status) {
    case 'ACTION_REQUIRED':
      return theme.palette.primary.main;
    case 'DONE':
      return theme.palette.success.main;
    case 'FAILED':
      return theme.palette.error.main;
    default:
      return theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800];
  }
};

export const CircularProgress = styled(MuiCircularProgress, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: Status }>(({ theme, status }) => ({
  color: getStatusColor(status, theme),
}));

export const CircularProgressPending = styled(MuiCircularProgress)(
  ({ theme }) => ({
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.primary.light,
    animationDuration: '3s',
    position: 'absolute',
    left: 0,
    [`.${circularProgressClasses.circle}`]: {
      animationDuration: '2s',
      animationTimingFunction: 'linear',
      animationName: circleAnimation,
      strokeDasharray: 129,
      strokeDashoffset: 129,
      strokeLinecap: 'round',
      transformOrigin: '100% 100%',
    },
  }),
);
