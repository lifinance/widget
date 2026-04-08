import { Box, styled, Typography } from '@mui/material'
import type React from 'react'

export const DateLabelContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
  })

export const DateLabelText: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)({
    fontSize: 12,
    fontWeight: 500,
  })
