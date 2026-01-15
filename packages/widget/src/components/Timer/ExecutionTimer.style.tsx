import InfoRounded from '@mui/icons-material/InfoRounded'
import {
  Box,
  CircularProgress as MuiCircularProgress,
  styled,
  Typography,
} from '@mui/material'

export const TIMER_SIZE = 96

export const TimerContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: TIMER_SIZE,
  height: TIMER_SIZE,
}))

export const BackgroundProgress = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.grey[300],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[800],
  }),
}))

export const ProgressRing = styled(MuiCircularProgress)(({ theme }) => ({
  position: 'absolute',
  color: theme.vars.palette.primary.main,
  transform: 'rotate(-90deg)',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  },
}))

export const TimerText = styled(Typography)(() => ({
  fontSize: 18,
  fontWeight: 700,
  color: 'text.primary',
  zIndex: 1,
}))

export const ActionRequiredContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: TIMER_SIZE - 12,
  height: TIMER_SIZE - 12,
  borderRadius: '50%',
  backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.08)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const ActionRequiredIcon = styled(InfoRounded)(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: 24,
  color: theme.vars.palette.info.main,
}))
