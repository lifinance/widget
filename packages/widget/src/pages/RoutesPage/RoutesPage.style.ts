import { Stack as MuiStack, styled } from '@mui/material'
import type React from 'react'

export const Stack: React.FC<React.ComponentProps<typeof MuiStack>> = styled(
  MuiStack
)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(0, 3, 3, 3),
}))
