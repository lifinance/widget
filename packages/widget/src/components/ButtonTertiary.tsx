import { Button, buttonClasses, styled } from '@mui/material'
import type React from 'react'

export const ButtonTertiary: React.FC<React.ComponentProps<typeof Button>> =
  styled(Button)(({ theme }) => ({
    color: theme.vars.palette.text.primary,
    height: 40,
    fontSize: 14,
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    '&:hover, &:active': {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
    },
    [`&.${buttonClasses.loading}:disabled`]: {
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
    },
    ...theme.applyStyles('dark', {
      color: theme.vars.palette.text.primary,
      backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
      '&:hover, &:active': {
        backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.08)`,
      },
      [`&.${buttonClasses.loading}:disabled`]: {
        backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
      },
    }),
    [`.${buttonClasses.loadingIndicator}`]: {
      color: theme.vars.palette.text.primary,
    },
  }))
