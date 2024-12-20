import type { CardProps as MuiCardProps } from '@mui/material'
import { Card as MuiCard, alpha, darken, lighten, styled } from '@mui/material'

export interface CardProps extends MuiCardProps {
  type?: 'default' | 'selected' | 'error'
  selectionColor?: 'primary' | 'secondary'
  indented?: boolean
}

export const Card = styled(MuiCard, {
  shouldForwardProp: (prop) =>
    !['type', 'indented', 'selectionColor'].includes(prop as string),
})<CardProps>(({ theme }) => {
  return {
    padding: 0,
    variants: [
      {
        props: ({ indented }) => indented,
        style: {
          padding: theme.spacing(2),
        },
      },
      {
        props: {
          selectionColor: 'primary',
          type: 'selected',
        },
        style: {
          backgroundColor: darken(theme.palette.primary.main, 0.65),
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: darken(theme.palette.primary.main, 0.6),
            ...theme.applyStyles('light', {
              backgroundColor: lighten(theme.palette.primary.main, 0.9),
            }),
          },
          ...theme.applyStyles('light', {
            backgroundColor: lighten(theme.palette.primary.main, 0.95),
          }),
        },
      },
      {
        props: {
          selectionColor: 'secondary',
          type: 'selected',
        },
        style: {
          backgroundColor: darken(theme.palette.secondary.main, 0.76),
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: alpha(theme.palette.secondary.main, 0.2),
          '&:hover': {
            backgroundColor: darken(theme.palette.secondary.main, 0.72),
            ...theme.applyStyles('light', {
              backgroundColor: lighten(theme.palette.secondary.main, 0.8),
            }),
          },
          ...theme.applyStyles('light', {
            backgroundColor: lighten(theme.palette.secondary.main, 0.85),
          }),
        },
      },
      {
        props: {
          type: 'error',
        },
        style: {
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: theme.palette.error.main,
        },
      },
    ],
  }
})
