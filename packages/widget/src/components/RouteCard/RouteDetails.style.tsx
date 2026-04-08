import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { Box, styled, Typography } from '@mui/material'
import type React from 'react'

export const DetailRow: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const DetailLabelContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  }))

export const DetailLabel: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 1.3334,
    color: theme.vars.palette.text.secondary,
  }))

export const DetailValue: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(() => ({
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.3334,
    textAlign: 'right',
  }))

export const DetailInfoIcon: React.FC<
  React.ComponentProps<typeof InfoOutlined>
> = styled(InfoOutlined)(({ theme }) => ({
  fontSize: 16,
  color: theme.vars.palette.text.secondary,
  cursor: 'help',
}))
