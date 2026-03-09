import { Box, styled, Typography } from '@mui/material'

export const CardContent = styled(Box)({
  padding: 24,
})

export const StatusBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  marginBottom: 12,
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 12,
  paddingBottom: 12,
  borderRadius: theme.vars.shape.borderRadiusSecondary,
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
}))

export const ErrorIconCircle = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: 'rgba(211, 47, 47, 0.12)',
  flexShrink: 0,
})

export const StatusTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 600,
  flex: 1,
})

export const StatusMessage = styled(Typography)({
  fontSize: 14,
  fontWeight: 500,
  flex: 1,
})

export const TimerText = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
})
