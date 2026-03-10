import {
  Box,
  CircularProgress as MuiCircularProgress,
  styled,
  Typography,
} from '@mui/material'
import { iconCircleSize } from '../IconCircle/IconCircle.style.js'

export const StatusCircle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: iconCircleSize,
  height: iconCircleSize,
  borderRadius: '50%',
})

export const RingContainer = styled(Box)({
  position: 'relative',
  width: iconCircleSize,
  height: iconCircleSize,
})

export const ProgressTrack = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.divider,
}))

export const TimerLabel = styled(Typography)({
  fontSize: 22,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
})

export const IndeterminateRing: React.FC = () => (
  <RingContainer>
    <ProgressTrack
      variant="determinate"
      value={100}
      size={iconCircleSize}
      thickness={3}
    />
    <MuiCircularProgress
      variant="indeterminate"
      size={iconCircleSize}
      thickness={3}
      sx={{ position: 'absolute' }}
    />
  </RingContainer>
)
