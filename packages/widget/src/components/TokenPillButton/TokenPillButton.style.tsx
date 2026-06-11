import { ButtonBase, styled, Typography } from '@mui/material'
import type React from 'react'

export const TokenPill: React.FC<
  React.ComponentProps<typeof ButtonBase> & { selected?: boolean }
> = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  height: 36,
  borderRadius: 16,
  padding: theme.spacing(0.5, 1.5, 0.5, 0.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: theme.transitions.create(
    ['background-color', 'border-color', 'box-shadow'],
    {
      duration: theme.transitions.duration.short,
    }
  ),
  ...(selected
    ? {
        backgroundColor: theme.vars.palette.background.paper,
        border: '1px solid',
        borderColor: theme.vars.palette.grey[300],
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 96%, ${theme.vars.palette.common.onBackground})`,
        },
        ...theme.applyStyles('dark', {
          borderColor: theme.vars.palette.grey[800],
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.paper} 96%, ${theme.vars.palette.common.onBackground})`,
          },
        }),
      }
    : {
        backgroundColor: theme.vars.palette.primary.main,
        border: '1px solid transparent',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.04)',
        '&:hover': {
          backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 90%, black)`,
        },
        ...theme.applyStyles('dark', {
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.primary.main} 90%, white)`,
          },
        }),
      }),
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
