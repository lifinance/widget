import { Box, styled } from '@mui/material'
import type React from 'react'
import { ButtonTertiary } from '../ButtonTertiary.js'

export const ButtonContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2, 2, 2),
  }))

export const AmountInputButton: React.FC<
  React.ComponentProps<typeof ButtonTertiary>
> = styled(ButtonTertiary)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(0.5, 1.5),
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  height: 'auto',
  borderRadius: theme.shape.borderRadiusSecondary,
}))
