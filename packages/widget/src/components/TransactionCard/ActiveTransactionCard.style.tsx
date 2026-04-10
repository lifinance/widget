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

export const StatusRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: theme.vars.shape.borderRadiusTertiary,
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
}))

export const DeleteButton: React.FC<React.ComponentProps<typeof IconButton>> =
  styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(0.5),
    backgroundColor: theme.vars.palette.background.paper,
    width: 24,
    height: 24,
  }))
