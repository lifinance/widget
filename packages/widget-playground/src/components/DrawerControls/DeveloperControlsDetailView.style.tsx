import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const Content: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  flex: '1 0 0',
  minHeight: 0,
  overflowY: 'auto',
  padding: '24px 20px',
})

export const Title: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 700,
  lineHeight: '32px',
  margin: 0,
  marginBottom: 8,
  color: theme.vars.palette.text.primary,
}))

export const ToggleSection: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  width: '100%',
})

export const ToggleItem: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '32px 0',
  width: '100%',
})

export const ToggleRow: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  width: '100%',
})

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
    paddingTop: 12,
    color: theme.vars.palette.text.secondary,
  }))

export const SubtitleDescription: FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(({ theme }) => ({
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',
    margin: 0,
    color: theme.vars.palette.text.secondary,
  }))

export const ConfigureLink: FC<React.ComponentProps<typeof ButtonBase>> =
  styled(ButtonBase)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.primary.main,
    padding: 0,
    paddingTop: 12,
    alignSelf: 'flex-start',
    '&:hover': {
      textDecoration: 'underline',
    },
  }))
