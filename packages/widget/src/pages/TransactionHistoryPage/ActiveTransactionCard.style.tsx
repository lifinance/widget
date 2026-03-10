import { Box, styled, Typography } from '@mui/material'

export const CardContent = styled(Box)({
  padding: 24,
})

export const StatusBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderRadius: theme.vars.shape.borderRadiusTertiary,
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
}))

export const StatusTitle = styled(Typography)({
  fontSize: 12,
  fontWeight: 500,
  flex: 1,
})

export const StatusMessage = styled(Typography)({
  fontSize: 12,
  fontWeight: 500,
  flex: 1,
})

export const TimerText = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
})
