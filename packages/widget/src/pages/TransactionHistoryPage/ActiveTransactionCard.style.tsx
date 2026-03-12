import { Button, IconButton, styled, Typography } from '@mui/material'

export const TimerText = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
})

export const DeleteButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
  backgroundColor: theme.vars.palette.background.paper,
  width: 24,
  height: 24,
}))

export const RetryButton = styled(Button)(({ theme }) => ({
  fontWeight: 700,
  fontSize: 12,
  height: 24,
  minWidth: 'auto',
  padding: theme.spacing(0.5, 1),
  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.background.paper,
  '&:hover': {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  },
}))
