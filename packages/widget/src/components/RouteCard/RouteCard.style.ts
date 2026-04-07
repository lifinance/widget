import { Box, styled } from '@mui/material'
import type React from 'react'

export const TokenContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  }))
