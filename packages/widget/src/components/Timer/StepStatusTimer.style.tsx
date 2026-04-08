import {
  Box,
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
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))

export const ProgressFill: React.FC<
  React.ComponentProps<typeof MuiCircularProgress>
> = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
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
