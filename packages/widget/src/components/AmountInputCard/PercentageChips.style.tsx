import { Box, Button, styled } from '@mui/material'
import type React from 'react'

export const ChipContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}))

export const Chip: React.FC<React.ComponentProps<typeof Button>> = styled(
  Button
)(({ theme }) => ({
  minWidth: 0,
  padding: theme.spacing(0.5, 1.5),
  fontSize: 12,
  fontWeight: 700,
  lineHeight: 1.3334,
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  color: theme.vars.palette.text.primary,
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
  },
}))
