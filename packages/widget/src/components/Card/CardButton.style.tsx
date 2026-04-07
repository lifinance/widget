import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type React from 'react'

export const CardRowButton: React.FC<React.ComponentProps<typeof ButtonBase>> =
  styled(ButtonBase)(({ theme }) => ({
    background: 'none',
    color: 'inherit',
    border: 'none',
    font: 'inherit',
    cursor: 'pointer',
    outline: 'inherit',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: theme.vars.shape.borderRadius,
  }))

export const CardValue: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)({
    lineHeight: '1.25',
    fontWeight: 500,
  })

export const CardTitleContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  }))
