import { Box, styled } from '@mui/material'
import type React from 'react'

export const BalanceContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  }))
