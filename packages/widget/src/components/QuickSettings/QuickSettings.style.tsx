import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type React from 'react'

export const QuickSettingsContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

export const QuickSettingButton: React.FC<
  React.ComponentProps<typeof ButtonBase>
> = styled(ButtonBase)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: theme.vars.shape.borderRadius,
}))

export const QuickSettingTitle: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 700,
  color: theme.vars.palette.text.primary,
}))

export const QuickSettingValue: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 500,
  color: theme.vars.palette.text.secondary,
  whiteSpace: 'nowrap',
}))
