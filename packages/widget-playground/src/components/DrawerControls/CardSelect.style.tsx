import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export interface CardSelectRootProps {
  selected: boolean
}

export const CardSelectRoot: FC<
  React.ComponentProps<typeof ButtonBase> & CardSelectRootProps
> = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<CardSelectRootProps>(({ theme, selected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 16,
  width: '100%',
  padding: 20,
  borderRadius: 12,
  border: '1px solid',
  borderColor: selected
    ? theme.vars.palette.primary.main
    : theme.vars.palette.grey[300],
  backgroundColor: theme.vars.palette.background.paper,
  textAlign: 'left',
  transition: theme.transitions.create(
    ['background-color', 'border-color', 'opacity'],
    {
      duration: theme.transitions.duration.shorter,
    }
  ),
  '&:not(.Mui-disabled):hover': {
    backgroundColor: theme.vars.palette.action.hover,
  },
  '&.Mui-disabled': {
    opacity: 0.45,
  },
  ...theme.applyStyles('dark', {
    borderColor: selected
      ? theme.vars.palette.primary.main
      : theme.vars.palette.grey[700],
  }),
}))

export const CardTitle: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
  width: '100%',
}))

export const CardDescription: FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.secondary,
    width: '100%',
  }))

export const CardTextContainer: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  width: '100%',
})
