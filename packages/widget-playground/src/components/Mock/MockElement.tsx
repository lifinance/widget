import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import type React from 'react'

export const MockElement: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  backgroundColor: theme.vars.palette.background.paper,
  width: '100%',
  height: 48,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))
