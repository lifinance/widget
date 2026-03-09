import {
  Box,
  CircularProgress as MuiCircularProgress,
  styled,
  Typography,
} from '@mui/material'

export const circleSize = 96

export const StatusCircle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: circleSize,
  height: circleSize,
  borderRadius: '50%',
})

export const RingContainer = styled(Box)({
  position: 'relative',
  width: circleSize,
  height: circleSize,
})

export const ProgressTrack = styled(MuiCircularProgress)({
  position: 'absolute',
  color: 'divider',
})

export const TimerLabel = styled(Typography)({
  fontSize: 22,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
})
