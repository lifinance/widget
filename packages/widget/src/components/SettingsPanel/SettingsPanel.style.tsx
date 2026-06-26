import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type React from 'react'

export const SettingsPanelContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

export const SettingsPanelButton: React.FC<
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

export const SettingsPanelTitle: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 700,
  color: theme.vars.palette.text.primary,
}))

export const SettingsPanelValue: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  lineHeight: 1,
  fontWeight: 500,
  color: theme.vars.palette.text.secondary,
  whiteSpace: 'nowrap',
}))
