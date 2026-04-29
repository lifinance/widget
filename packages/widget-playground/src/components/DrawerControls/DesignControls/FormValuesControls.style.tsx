import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const SectionLabel: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: '16px',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: theme.vars.palette.text.secondary,
  marginBottom: 8,
}))

export const MethodHint: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 400,
  lineHeight: '20px',
  margin: 0,
  marginTop: 8,
  color: theme.vars.palette.text.secondary,
}))

export const OptionButton: FC<
  React.ComponentProps<typeof ButtonBase> & { selected: boolean }
> = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: 44,
  padding: '10px 16px',
  borderRadius: 8,
  border: '2px solid',
  borderColor: selected
    ? theme.vars.palette.primary.main
    : theme.vars.palette.grey[300],
  backgroundColor: theme.vars.palette.background.paper,
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.primary,
  textAlign: 'center',
  transition: theme.transitions.create('border-color', {
    duration: theme.transitions.duration.shorter,
  }),
  ...theme.applyStyles('dark', {
    borderColor: selected
      ? theme.vars.palette.primary.main
      : theme.vars.palette.grey[700],
  }),
}))

export const PresetStack: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
})

export const FormBlock: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})
