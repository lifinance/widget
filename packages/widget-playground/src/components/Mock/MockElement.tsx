import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import type React from 'react'

export const mockElementHeight = 48

export const MockElement: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  width: '100%',
  height: mockElementHeight,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))
