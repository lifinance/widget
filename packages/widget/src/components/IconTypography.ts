import { Box, styled } from '@mui/material'
import type React from 'react'

export const IconTypography: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    color: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.4)`,
    lineHeight: 0,
    ...theme.applyStyles('dark', {
      color: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.32)`,
    }),
  }))
