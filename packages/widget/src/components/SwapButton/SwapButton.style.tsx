import { Box, styled } from '@mui/material'
import type React from 'react'
import { Card } from '../Card/Card.js'

// Sits just above MUI's appBar layer (1100) so the swap icon stays on top of the
// two overlapping amount cards it bridges.
const swapButtonZIndex = 1110

export const SwapIconCard: React.FC<React.ComponentProps<typeof Card>> = styled(
  Card
)(({ theme }) => ({
  height: 32,
  width: 32,
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.vars.shape.borderRadiusTertiary,
  zIndex: swapButtonZIndex,
}))

export const SwapButtonContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(-1.5),
  }))
