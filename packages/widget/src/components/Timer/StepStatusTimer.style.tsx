import {
  Box,
  circularProgressClasses,
  keyframes,
  CircularProgress as MuiCircularProgress,
  styled,
  Typography,
} from '@mui/material'
import type React from 'react'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'

export const StatusCircle: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const RingContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)({
  position: 'relative',
  width: iconCircleSize,
  height: iconCircleSize,
})

export const ProgressTrack: React.FC<
  React.ComponentProps<typeof MuiCircularProgress>
> = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))

export const ProgressFill: React.FC<
  React.ComponentProps<typeof MuiCircularProgress>
> = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  color: theme.vars.palette.primary.main,
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.primary.light,
  }),
}))

export const TimerLabel: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)({
    fontSize: 18,
    fontWeight: 700,
  })

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
`

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
export const CircularProgressPending: React.FC<
  React.ComponentProps<typeof MuiCircularProgress>
> = styled(MuiCircularProgress)`
  color: ${({ theme }) => theme.vars.palette.primary.main};
  ${({ theme }) =>
    theme.applyStyles('dark', {
      color: theme.vars.palette.primary.light,
    })}
  animation-duration: 3s;
  position: absolute;
  top: 0;
  left: 0;
  .${circularProgressClasses.circle} {
    animation-duration: 2s;
    animation-timing-function: linear;
    animation-name: ${circleAnimation};
    stroke-dasharray: 129;
    stroke-dashoffset: 129;
    stroke-linecap: round;
    transform-origin: 100% 100%;
  }
`
