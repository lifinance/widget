import type { Theme } from '@mui/material'
import { Box, IconButton, styled } from '@mui/material'
import type React from 'react'

type StatusIconColor = 'error' | 'info'

const getStatusIconChannel = (color: StatusIconColor, theme: Theme) =>
  color === 'error'
    ? theme.vars.palette.error.mainChannel
    : theme.vars.palette.info.mainChannel

export const StatusIconCircle: React.FC<
  React.ComponentProps<typeof Box> & { color: StatusIconColor }
> = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<{ color: StatusIconColor }>(({ theme, color }) => {
  const channel = getStatusIconChannel(color, theme)
  return {
    backgroundColor: `color-mix(in srgb, rgb(${channel}) 12%, ${theme.vars.palette.background.paper})`,
    borderRadius: '50%',
    width: 24,
    height: 24,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    '& > svg': {
      color: `color-mix(in srgb, rgb(${channel}) 100%, black)`,
      width: 14,
      height: 14,
    },
    ...theme.applyStyles('dark', {
      '& > svg': {
        color: `color-mix(in srgb, rgb(${channel}) 100%, black)`,
      },
    }),
  }
})

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
  backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
}))

export const DeleteButton: React.FC<React.ComponentProps<typeof IconButton>> =
  styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(0.5),
    backgroundColor: theme.vars.palette.background.paper,
    width: 24,
    height: 24,
  }))
