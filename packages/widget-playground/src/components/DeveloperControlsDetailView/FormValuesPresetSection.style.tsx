import { Box, ButtonBase, styled, Typography } from '@mui/material'
import type { FC } from 'react'

export const FormBlock: FC<React.ComponentProps<typeof Box>> = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})

export const SectionLabel: FC<React.ComponentProps<typeof Typography>> = styled(
  Typography
)(({ theme }) => ({
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.vars.palette.text.secondary,
  marginBottom: theme.spacing(1),
}))

export const OptionButton: FC<
  React.ComponentProps<typeof ButtonBase> & { selected: boolean }
> = styled(
  (props: React.ComponentProps<typeof ButtonBase> & { selected: boolean }) => (
    <ButtonBase {...props} disableRipple />
  ),
  {
    shouldForwardProp: (prop) => prop !== 'selected',
  }
)<{ selected: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: 44,
  padding: theme.spacing(1.25, 2),
  borderRadius: 8,
  border: '1px solid',
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
  '&:hover': {
    borderColor: selected
      ? theme.vars.palette.primary.main
      : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 32%, transparent)`,
  },
  ...theme.applyStyles('dark', {
    borderColor: selected
      ? theme.vars.palette.primary.main
      : theme.vars.palette.grey[800],
    '&:hover': {
      borderColor: selected
        ? theme.vars.palette.primary.main
        : `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 48%, transparent)`,
    },
  }),
}))

export const PresetStack: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    width: '100%',
  })
)
