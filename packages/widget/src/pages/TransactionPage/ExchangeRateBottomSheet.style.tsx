import { Box, styled } from '@mui/material'
import type React from 'react'

export const CenterContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(() => ({
    display: 'grid',
    placeItems: 'center',
    position: 'relative',
  }))
