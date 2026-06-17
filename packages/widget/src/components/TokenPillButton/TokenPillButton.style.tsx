import { Button, styled, type Theme, Typography } from '@mui/material'
import type React from 'react'

const pillLayout = (theme: Theme) => ({
  height: 36,
  borderRadius: theme.shape.borderRadiusSecondary,
  padding: theme.spacing(0.5, 1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  whiteSpace: 'nowrap',
  flexShrink: 0,
})

export const TokenPill: React.FC<React.ComponentProps<typeof Button>> = styled(
  Button
)(({ theme }) => ({
  ...pillLayout(theme),
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
  border: '1px solid transparent',
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
  },
}))

export const TokenSelectPill: React.FC<React.ComponentProps<typeof Button>> =
  styled(Button)(({ theme }) => ({
    ...pillLayout(theme),
    minWidth: 0,
  }))

export const TokenPillSymbol: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 700,
  lineHeight: '18px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: theme.vars.palette.text.primary,
}))

export const TokenPillLabel: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 700,
    lineHeight: '18px',
    color: theme.vars.palette.primary.contrastText,
  }))
