import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type React from 'react'

export const Container: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

export const SettingsRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 1.5),
}))

export const ExpiryValue: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.vars.palette.text.secondary,
}))

/** Full-width settings row rendered inside a `Card`, opening the expiry menu. */
export const QuickSettingButton: React.FC<
  React.ComponentProps<typeof ButtonBase>
> = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: theme.vars.shape.borderRadius,
}))

export const QuickSettingTitle: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
  color: theme.vars.palette.text.primary,
}))

export const QuickSettingValue: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 600,
  color: theme.vars.palette.text.secondary,
}))
