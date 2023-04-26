import type { Status, Substatus } from '@lifi/sdk';
import type { Theme } from '@mui/material';
import { Box, CircularProgress as MuiCircularProgress } from '@mui/material';
import { circularProgressClasses } from '@mui/material/CircularProgress';
import { alpha, keyframes, styled } from '@mui/material/styles';

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

const getStatusColor = (
  theme: Theme,
  status: Status,
  substatus?: Substatus,
) => {
  switch (status) {
    case 'ACTION_REQUIRED':
      return alpha(theme.palette.info.main, 0.12);
    case 'DONE':
      if (substatus === 'PARTIAL' || substatus === 'REFUNDED') {
        return alpha(theme.palette.warning.main, 0.48);
      }
      return alpha(theme.palette.success.main, 0.12);
    case 'FAILED':
      return alpha(theme.palette.error.main, 0.12);
    default:
      return theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800];
  }
};

export const CircularIcon = styled(Box, {
  shouldForwardProp: (prop: string) => !['status', 'substatus'].includes(prop),
})<{ status: Status; substatus?: Substatus }>(
  ({ theme, status, substatus }) => ({
    backgroundColor: ['ACTION_REQUIRED', 'DONE', 'FAILED'].includes(status)
      ? getStatusColor(theme, status, substatus)
      : theme.palette.background.paper,
    borderStyle: 'solid',
    borderColor: getStatusColor(theme, status, substatus),
    borderWidth: !['ACTION_REQUIRED', 'DONE', 'FAILED'].includes(status)
      ? 2
      : 0,
    display: 'grid',
    position: 'relative',
    placeItems: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
  }),
);

export const CircularProgressPending = styled(MuiCircularProgress)(
  ({ theme }) => ({
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary.main
        : theme.palette.primary.light,
    animationDuration: '3s',
    position: 'absolute',
    left: '-2px',
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
