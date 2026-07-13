import { Box, InputBase, inputBaseClasses, styled } from '@mui/material'
import type { FC } from 'react'

export const Field: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  })
)

export const FieldLabel: FC<React.ComponentProps<typeof Box>> = styled(Box)(
  ({ theme }) => ({
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
    color: theme.vars.palette.text.secondary,
  })
)

export const FieldInput: FC<React.ComponentProps<typeof InputBase>> = styled(
  InputBase
)(({ theme }) => ({
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 12,
  border: '1px solid',
  borderColor: theme.vars.palette.divider,
  backgroundColor: theme.vars.palette.background.paper,
  transition: 'border-color 0.15s',
  '&:hover': {
    borderColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 24%, transparent)`,
  },
  [`&.${inputBaseClasses.focused}`]: {
    borderColor: theme.vars.palette.primary.main,
  },
  [`& .${inputBaseClasses.input}`]: {
    padding: 0,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '20px',
    color: theme.vars.palette.text.primary,
    '&::placeholder': {
      color: theme.vars.palette.text.secondary,
      opacity: 0.6,
    },
  },
}))
