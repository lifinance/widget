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

export const ActionIconCircle: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.success.main} 12%, ${theme.vars.palette.background.paper})`,
  }))

export const ActionRowLabel: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    flex: 1,
    fontSize: 12,
    fontWeight: 500,
    color: theme.vars.palette.text.primary,
  }))
