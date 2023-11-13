import type { Status, Substatus } from '@lifi/sdk';
import type { Theme } from '@mui/material';
import { Box, CircularProgress as MuiCircularProgress } from '@mui/material';
import { circularProgressClasses } from '@mui/material/CircularProgress';
import { alpha, keyframes, styled } from '@mui/material/styles';

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

const circleAnimation = keyframes`
  0% {
    stroke-dashoffset: 129;
    transform: rotate(0);
  }
  50% {
    stroke-dashoffset: 56;
    transform: rotate(45deg);
  };
  100% {
    stroke-dashoffset: 129;
    transform: rotate(360deg);
  }
`;

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
export const CircularProgressPending = styled(MuiCircularProgress)`
  color: ${({ theme }) =>
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.primary.light};
  animation-duration: 3s;
  position: absolute;
  left: -2px;
  .${circularProgressClasses.circle} {
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-name: ${circleAnimation};
    stroke-dasharray: 129;
    stroke-dashoffset: 129;
    stroke-linecap: round;
    transform-origin: 100% 100%;
  }
`;
