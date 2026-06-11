import { Box, styled } from '@mui/material'
import type React from 'react'
import { Card } from '../Card/Card.js'

export const SwapIconCard: React.FC<React.ComponentProps<typeof Card>> = styled(
  Card
)(({ theme }) => ({
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  border: '4px solid',
  borderColor: theme.vars.palette.background.default,
  backgroundColor: theme.vars.palette.background.paper,
  zIndex: 1110,
  cursor: 'pointer',
  fontSize: 18,
  color: theme.vars.palette.text.primary,
  transition: theme.transitions.create(['background-color', 'border-color'], {
    duration: theme.transitions.duration.short,
  }),
}))

export const SwapButtonContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
    marginBottom: -12,
    zIndex: 1110,
    position: 'relative',
  }))
