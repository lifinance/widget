import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const ToggleSection: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const ToggleItem: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4, 0),
    width: '100%',
  })
)

export const DevToggleRow: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    width: '100%',
  })
)

export const ToggleLabel: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  flex: '1 0 0',
  minWidth: 0,
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
}))

export const ToggleDescription: FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    margin: 0,
    paddingTop: theme.spacing(1.5),
    color: theme.vars.palette.text.secondary,
  }))

export const NestedToggleRow: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  width: '100%',
  paddingTop: theme.spacing(1.5),
}))

export const NestedToggleLabel: FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    flex: '1 0 0',
    minWidth: 0,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.primary,
  }))

export const ConfigureLink: FC<React.ComponentProps<typeof ButtonBase>> =
  styled(ButtonBase)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.primary.main,
    padding: 0,
    paddingTop: theme.spacing(1.5),
    alignSelf: 'flex-start',
    '&:hover': {
      textDecoration: 'underline',
    },
  }))
