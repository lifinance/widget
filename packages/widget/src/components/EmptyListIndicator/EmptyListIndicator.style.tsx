import { Container, styled, Typography } from '@mui/material'
import type React from 'react'

export const EmptyListContainer: React.FC<
  React.ComponentProps<typeof Container>
> = styled(Container)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
}))

export const EmptyListIcon: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)({
    fontSize: 48,
    '& > svg': {
      fontSize: 'inherit',
    },
  })

export const EmptyListTitle: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 18,
    fontWeight: 700,
    marginTop: theme.spacing(2),
  }))

export const EmptyListMessage: React.FC<
  React.ComponentProps<typeof Typography>
> = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.vars.palette.text.secondary,
  textAlign: 'center',
  marginTop: theme.spacing(2),
}))
