import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import { Box, ButtonBase, IconButton, styled } from '@mui/material'
import type { FC } from 'react'

export const HeaderContainer: FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: theme.spacing(1.5, 2.5),
  backgroundColor: theme.vars.palette.background.default,
}))

export const BackButton: FC<React.ComponentProps<typeof ButtonBase>> = styled(
  ButtonBase
)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  flexShrink: 0,
  margin: theme.spacing(0, -1),
  padding: theme.spacing(0.5, 1),
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
  borderRadius: 8,
  transition: theme.transitions.create('background-color', {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    backgroundColor: theme.vars.palette.action.hover,
  },
}))

export const BackIcon: FC<React.ComponentProps<typeof ArrowBackOutlinedIcon>> =
  styled(ArrowBackOutlinedIcon)({
    fontSize: 24,
    width: 24,
    height: 24,
    marginLeft: -4,
  })

export const HeaderIconButton: FC<React.ComponentProps<typeof IconButton>> =
  styled(IconButton)(({ theme }) => ({
    flexShrink: 0,
    marginRight: theme.spacing(-1),
    color: theme.vars.palette.text.primary,
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      backgroundColor: theme.vars.palette.action.hover,
    },
  }))
