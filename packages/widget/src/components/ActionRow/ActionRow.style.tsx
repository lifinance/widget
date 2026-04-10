import { Box, styled, Typography } from '@mui/material'
import type React from 'react'

export const ActionRowContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.vars.shape.borderRadiusTertiary,
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  }))

export const ActionRowLabel: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    flex: 1,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.3334,
    color: theme.vars.palette.text.primary,
  }))
