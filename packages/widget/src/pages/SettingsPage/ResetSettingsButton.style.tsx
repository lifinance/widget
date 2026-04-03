import { Box, styled } from '@mui/material'
import type React from 'react'

export const ResetButtonContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    background: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    borderRadius: '16px',
    padding: '16px',
    svg: {
      fill: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.4)`,
    },
  }))
