import { Box, Link, styled } from '@mui/material'
import type React from 'react'

export const ActionIconCircle: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.success.main} 12%, ${theme.vars.palette.background.paper})`,
  }))

export const ExternalLink: React.FC<React.ComponentProps<typeof Link>> = styled(
  Link
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  textDecoration: 'none',
  color: theme.vars.palette.text.primary,
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  },
}))
