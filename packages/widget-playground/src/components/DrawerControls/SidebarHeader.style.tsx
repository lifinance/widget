import { Box, IconButton, styled } from '@mui/material'
import type { FC } from 'react'

export const HeaderContainer: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  padding: theme.spacing(1.5, 2.5),
  backgroundColor: theme.vars.palette.background.default,
}))

export const HeaderActions: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
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
