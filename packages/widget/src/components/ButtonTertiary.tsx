import { Button, buttonClasses, styled } from '@mui/material'
import type React from 'react'

export const ButtonTertiary: React.FC<React.ComponentProps<typeof Button>> =
  styled(Button)(({ theme }) => ({
    color: theme.vars.palette.text.primary,
    height: 40,
    fontSize: 14,
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    '&:hover, &:active': {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
    },
    [`&.${buttonClasses.loading}:disabled`]: {
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
    },
    ...theme.applyStyles('dark', {
      color: theme.vars.palette.text.primary,
      backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
      '&:hover, &:active': {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 8%, transparent)`,
      },
      [`&.${buttonClasses.loading}:disabled`]: {
        backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
      },
    }),
    [`.${buttonClasses.loadingIndicator}`]: {
      color: theme.vars.palette.text.primary,
    },
  }))
