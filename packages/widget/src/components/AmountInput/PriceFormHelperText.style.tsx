import { Button, styled } from '@mui/material'
import type React from 'react'

export const InputPriceButton: React.FC<React.ComponentProps<typeof Button>> =
  styled(Button)(({ theme, onClick }) => ({
    color: theme.vars.palette.text.secondary,
    padding: theme.spacing(0.25, 0.5, 0.25, 0.75),
    maxHeight: 16,
    fontSize: '0.75rem',
    fontWeight: 500,
    borderRadius: `calc(${theme.vars.shape.borderRadius} * 2)`,
    backgroundColor: 'transparent',
    minWidth: 32,
    ...(onClick
      ? {
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
          },
          ...theme.applyStyles('dark', {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: `color-mix(in srgb, ${theme.vars.palette.common.onBackground} 4%, transparent)`,
            },
          }),
        }
      : {
          cursor: 'text',
          userSelect: 'text',
          pointerEvents: 'none',
          ...theme.applyStyles('dark', {
            backgroundColor: 'transparent',
          }),
        }),
  }))
