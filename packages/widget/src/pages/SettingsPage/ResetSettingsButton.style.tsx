import { Box, styled } from '@mui/material'
import type React from 'react'

export const ResetButtonContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    background: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    borderRadius: '16px',
    padding: '16px',
    svg: {
      fill: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 40%, transparent)`,
    },
  }))
