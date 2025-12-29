import {
  Box,
  CircularProgress as MuiCircularProgress,
  styled,
  Typography,
} from '@mui/material'

export const CenterContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const TimerCircleContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 120,
  height: 120,
}))

export const TimerCircularProgress = styled(MuiCircularProgress)(
  ({ theme }) => ({
    position: 'absolute',
    color: theme.vars.palette.primary.main,
    ...theme.applyStyles('dark', {
      color: theme.vars.palette.primary.light,
    }),
  })
)

export const TimerText = styled(Typography)(({ theme }) => ({
  fontSize: 28,
  fontWeight: 700,
  color: theme.vars.palette.text.primary,
  zIndex: 1,
}))

export const StatusMessage = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.vars.palette.text.primary,
  marginTop: theme.spacing(2),
  textAlign: 'center',
}))

export const TokenExchangeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: theme.spacing(3),
}))

export const ArrowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.spacing(2.5),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}))
