import { Box, IconButton, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const HeaderContainer: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(4),
  padding: theme.spacing(1.5, 2.5),
  backgroundColor: theme.vars.palette.background.paper,
}))

export const HeaderActions: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    flexShrink: 0,
    marginRight: theme.spacing(-1),
  })
)

export const HeaderIconButton: FC<React.ComponentProps<typeof IconButton>> =
  styled(IconButton)(({ theme }) => ({
    color: theme.vars.palette.text.primary,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      backgroundColor: theme.vars.palette.action.hover,
    },
  }))

export const LogoContainer: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    flex: '1 0 0',
    minWidth: 0,
  })
)

export const BrandSuffix: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
  flexShrink: 0,
}))
