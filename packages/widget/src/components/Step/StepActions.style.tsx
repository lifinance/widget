import { Box, styled, Typography } from '@mui/material'
import type React from 'react'
import { AvatarMasked } from '../Avatar/Avatar.style.js'

export const StepLabelTypography: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.3334,
  color: theme.vars.palette.text.primary,
  whiteSpace: 'nowrap',
}))

export const StepAvatar: React.FC<React.ComponentProps<typeof AvatarMasked>> =
  styled(AvatarMasked)(({ theme }) => ({
    color: theme.vars.palette.text.primary,
    backgroundColor: 'transparent',
  }))

export const StepActionsHeader: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }))

export const StepActionsTitle: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(() => ({
  fontSize: 12,
  fontWeight: 700,
}))
