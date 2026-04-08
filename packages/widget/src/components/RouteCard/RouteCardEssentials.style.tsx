import { Box, styled, Typography } from '@mui/material'
import type React from 'react'

export const EssentialsContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginTop: theme.spacing(2),
    gap: theme.spacing(1.5),
  }))

export const EssentialsRateTypography: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.vars.palette.text.secondary,
  cursor: 'pointer',
  '&:hover': {
    color: theme.vars.palette.text.primary,
  },
  transition: theme.transitions.create(['color'], {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.easeOut,
  }),
}))

export const EssentialsValueTypography: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.vars.palette.text.primary,
  fontWeight: 600,
}))

export const EssentialsIconValueContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
}))
