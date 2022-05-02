import { CircularProgress as MuiCircularProgress } from '@mui/material';
import { circularProgressClasses } from '@mui/material/CircularProgress';
import { keyframes, styled } from '@mui/material/styles';

const circleAnimation = keyframes({
  '0%': {
    strokeDashoffset: 129,
    transform: 'rotate(0)',
  },
  '50%': {
    strokeDashoffset: 64,
    transform: 'rotate(45deg)',
  },
  '100%': {
    strokeDashoffset: 129,
    transform: 'rotate(360deg)',
  },
});

export const CircularProgress = styled(MuiCircularProgress)(({ theme }) => ({
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
}));
