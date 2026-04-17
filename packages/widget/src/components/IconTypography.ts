import { Box, styled } from '@mui/material'
import type React from 'react'

export const IconTypography: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    color: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 40%, transparent)`,
    lineHeight: 0,
    ...theme.applyStyles('dark', {
      color: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 32%, transparent)`,
    }),
  }))
