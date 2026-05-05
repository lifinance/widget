import { Box, IconButton, styled } from '@mui/material'
import type React from 'react'

export const PendingCircle: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  position: 'relative',
  width: 24,
  height: 24,
  flexShrink: 0,
  borderRadius: '50%',
  border: `2px solid ${theme.vars.palette.grey[300]}`,
  ...theme.applyStyles('dark', {
    borderColor: theme.vars.palette.grey[800],
  }),
}))

export const DeleteButton: React.FC<React.ComponentProps<typeof IconButton>> =
  styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(0.5),
    backgroundColor: theme.vars.palette.background.paper,
    width: 24,
    height: 24,
  }))

export const RetryButton: React.FC<React.ComponentProps<typeof IconButton>> =
  styled(IconButton)(({ theme }) => ({
    fontWeight: 700,
    fontSize: 12,
    height: 24,
    borderRadius: theme.vars.shape.borderRadius,
    padding: theme.spacing(0.5, 1.5),
    color: theme.vars.palette.text.primary,
    backgroundColor: theme.vars.palette.background.paper,
  }))
