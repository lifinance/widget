import {
  Box,
  CircularProgress as MuiCircularProgress,
  styled,
  Typography,
} from '@mui/material'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'

export const StatusCircle = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const RingContainer = styled(Box)({
  position: 'relative',
  width: iconCircleSize,
  height: iconCircleSize,
})

export const ProgressTrack = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))

export const TimerLabel = styled(Typography)({
  fontSize: 18,
  fontWeight: 700,
})
